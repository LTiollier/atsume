<?php

declare(strict_types=1);

namespace App\User\Application\Actions;

use App\User\Domain\Exceptions\ProfileNotFoundOrPrivateException;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;

final class GetPublicUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function execute(string $username): User
    {
        $user = $this->userRepository->findByUsername($username);

        if (! $user || ! $user->isPublic()) {
            throw new ProfileNotFoundOrPrivateException('Profile not found or is private.');
        }

        return $user;
    }
}
