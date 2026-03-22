<?php

declare(strict_types=1);

namespace App\Manga\Application\Actions;

use App\Manga\Application\DTOs\AddToWishlistDTO;
use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Models\Edition;
use InvalidArgumentException;

final class AddToWishlistAction
{
    public function __construct(
        private readonly AddEditionToWishlistAction $addEditionAction,
        private readonly AddBoxToWishlistAction $addBoxAction,
    ) {}

    public function execute(AddToWishlistDTO $dto): Edition|Box
    {
        return match ($dto->wishlistableType) {
            'edition' => $this->addEditionAction->execute($dto->wishlistableId, $dto->userId),
            'box' => $this->addBoxAction->execute($dto->wishlistableId, $dto->userId),
            default => throw new InvalidArgumentException('Invalid wishlistable type: '.$dto->wishlistableType),
        };
    }
}
