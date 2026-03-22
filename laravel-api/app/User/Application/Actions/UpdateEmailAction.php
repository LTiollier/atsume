<?php

namespace App\User\Application\Actions;

use App\User\Application\DTOs\UpdateEmailDTO;
use App\User\Domain\Exceptions\InvalidCredentialsException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class UpdateEmailAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(UpdateEmailDTO $dto, int $userId): User
    {
        $user = $this->userRepository->findById($userId);

        if (! $user) {
            throw new InvalidArgumentException('User not found.');
        }

        if (! Hash::check($dto->currentPassword, $user->getPassword())) {
            throw new InvalidCredentialsException('Le mot de passe actuel est incorrect.');
        }

        $updatedUser = new User(
            name: $user->getName(),
            email: $dto->email,
            password: $user->getPassword(),
            id: $user->getId(),
            username: $user->getUsername(),
            isPublic: $user->isPublic(),
            theme: $user->getTheme(),
            palette: $user->getPalette()
        );

        return $this->userRepository->update($updatedUser);
    }
}
