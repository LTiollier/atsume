<?php

declare(strict_types=1);

namespace Tests\Unit\User\Application\Actions;

use App\User\Application\Actions\UpdateUserSettingsAction;
use App\User\Application\DTOs\UpdateUserSettingsDTO;
use App\User\Domain\Models\User;
use App\User\Domain\Repositories\UserRepositoryInterface;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

class UpdateUserSettingsActionTest extends TestCase
{
    public function test_it_updates_user_settings_successfully(): void
    {
        $userRepository = $this->createMock(UserRepositoryInterface::class);
        $action = new UpdateUserSettingsAction($userRepository);

        $existingUser = new User('Test User', 'test@example.com', 'password', 1);

        $dto = new UpdateUserSettingsDTO(1, 'new_username', true, 'light', 'kaminari', true);

        $userRepository->expects($this->once())
            ->method('findById')
            ->with(1)
            ->willReturn($existingUser);

        $userRepository->expects($this->once())
            ->method('update')
            ->willReturnCallback(function (User $user) {
                $this->assertEquals('new_username', $user->getUsername());
                $this->assertTrue($user->isPublic());
                $this->assertEquals('light', $user->getTheme());
                $this->assertEquals('kaminari', $user->getPalette());

                return $user;
            });

        $updatedUser = $action->execute($dto);
        $this->assertEquals('new_username', $updatedUser->getUsername());
        $this->assertTrue($updatedUser->isPublic());
        $this->assertEquals('light', $updatedUser->getTheme());
        $this->assertEquals('kaminari', $updatedUser->getPalette());
    }

    public function test_it_throws_exception_if_user_not_found(): void
    {
        $userRepository = $this->createMock(UserRepositoryInterface::class);
        $action = new UpdateUserSettingsAction($userRepository);

        $dto = new UpdateUserSettingsDTO(999, 'new_username', true, 'void', 'oni', false);

        $userRepository->expects($this->once())
            ->method('findById')
            ->with(999)
            ->willReturn(null);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('User not found.');

        $action->execute($dto);
    }
}
