<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Http\Api\Requests\ForgotPasswordRequest;
use App\Http\Api\Requests\LoginRequest;
use App\Http\Api\Requests\RegisterRequest;
use App\Http\Api\Requests\ResetPasswordRequest;
use App\Http\Api\Requests\VerifyEmailRequest;
use App\Http\Api\Resources\UserResource;
use App\User\Application\Actions\ForgotPasswordAction;
use App\User\Application\Actions\LoginAction;
use App\User\Application\Actions\LogoutAction;
use App\User\Application\Actions\RegisterUserAction;
use App\User\Application\Actions\ResetPasswordAction;
use App\User\Domain\Events\UserVerified;
use App\User\Domain\Exceptions\InvalidCredentialsException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use App\User\Infrastructure\EloquentModels\User as EloquentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

final class AuthController
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function register(RegisterRequest $request, RegisterUserAction $action): JsonResponse
    {
        $dto = $request->toDTO();

        $result = $action->execute($dto);

        return response()->json([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 201);
    }

    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        try {
            $dto = $request->toDTO();

            $result = $action->execute($dto);

            return response()->json([
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ]);
        } catch (InvalidCredentialsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function logout(Request $request, LogoutAction $action): JsonResponse
    {
        /** @var EloquentUser $eloquentUser */
        $eloquentUser = $request->user();

        $domainUser = new User(
            name: (string) $eloquentUser->name,
            email: (string) $eloquentUser->email,
            password: (string) $eloquentUser->password,
            id: (int) $eloquentUser->id,
            username: $eloquentUser->username ? (string) $eloquentUser->username : null,
            isPublic: (bool) $eloquentUser->is_public,
            theme: (string) ($eloquentUser->theme ?? 'void'),
            palette: (string) ($eloquentUser->palette ?? 'ember'),
            emailVerifiedAt: $eloquentUser->email_verified_at?->toIso8601String()
        );

        $action->execute($domainUser);

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }

    public function verify(VerifyEmailRequest $request): JsonResponse|RedirectResponse
    {
        /** @var string $id */
        $id = $request->route('id');
        $user = $this->userRepository->findById((int) $id);

        if (! $user) {
            abort(404);
        }

        if (! $user->isEmailVerified()) {
            $user = $this->userRepository->markAsVerified($user);
            event(new UserVerified($user));
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Email verified successfully.']);
        }

        /** @var string $frontendUrl */
        $frontendUrl = config('app.frontend_url');

        return redirect($frontendUrl.'/dashboard?verified=1');
    }

    public function sendVerificationNotification(Request $request): JsonResponse
    {
        /** @var EloquentUser $user */
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent.']);
    }

    public function forgotPassword(ForgotPasswordRequest $request, ForgotPasswordAction $action): JsonResponse
    {
        $status = $action->execute($request->toDTO());

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(ResetPasswordRequest $request, ResetPasswordAction $action): JsonResponse
    {
        $status = $action->execute($request->toDTO());

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }
}
