<?php

declare(strict_types=1);

use App\Manga\Domain\Exceptions\VolumeNotFoundException;

test('VolumeNotFoundException is a DomainException', function (): void {
    $exception = new VolumeNotFoundException('Manga not found for barcode: 9782723456789');

    expect($exception)->toBeInstanceOf(DomainException::class)
        ->and($exception->getMessage())->toBe('Manga not found for barcode: 9782723456789');
});
