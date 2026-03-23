<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Foundation\Http\FormRequest;

class VerifyEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var string|null $id */
        $id = $this->route('id');
        /** @var string|null $hash */
        $hash = $this->route('hash');

        if (! $id || ! $hash) {
            return false;
        }

        /** @var UserRepositoryInterface $userRepository */
        $userRepository = app(UserRepositoryInterface::class);
        $user = $userRepository->findById((int) $id);

        if (! $user) {
            return false;
        }

        if (! hash_equals((string) $hash, sha1($user->getEmail()))) {
            return false;
        }

        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
