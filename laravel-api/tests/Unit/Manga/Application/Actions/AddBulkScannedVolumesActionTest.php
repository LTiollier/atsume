<?php

declare(strict_types=1);

namespace Tests\Unit\Manga\Application\Actions;

use App\Manga\Application\Actions\AddBulkScannedVolumesAction;
use App\Manga\Application\Actions\AddScannedVolumeAction;
use App\Manga\Application\DTOs\ScanBulkVolumeDTO;
use App\Manga\Application\DTOs\ScanVolumeDTO;
use App\Manga\Domain\Models\Volume;
use Exception;
use Mockery;

test('it processes multiple ISBNs and returns volumes', function () {
    $addScannedMangaAction = Mockery::mock(AddScannedVolumeAction::class);

    $volume1 = Mockery::mock(Volume::class);
    $volume2 = Mockery::mock(Volume::class);

    $addScannedMangaAction->shouldReceive('execute')
        ->once()
        ->with(Mockery::on(fn (ScanVolumeDTO $dto) => $dto->isbn === '111' && $dto->userId === 1))
        ->andReturn($volume1);

    $addScannedMangaAction->shouldReceive('execute')
        ->once()
        ->with(Mockery::on(fn (ScanVolumeDTO $dto) => $dto->isbn === '222' && $dto->userId === 1))
        ->andReturn($volume2);

    $action = new AddBulkScannedVolumesAction($addScannedMangaAction);
    $dto = new ScanBulkVolumeDTO(userId: 1, isbns: ['111', '222']);

    $results = $action->execute($dto);

    expect($results)->toHaveCount(2)
        ->and($results[0])->toBe($volume1)
        ->and($results[1])->toBe($volume2);
});

test('it continues even if some scans fail', function () {
    $addScannedMangaAction = Mockery::mock(AddScannedVolumeAction::class);

    $volumeSuccess = Mockery::mock(Volume::class);

    $addScannedMangaAction->shouldReceive('execute')
        ->once()
        ->with(Mockery::on(fn (ScanVolumeDTO $dto) => $dto->isbn === 'FAIL'))
        ->andThrow(new Exception('API Error'));

    $addScannedMangaAction->shouldReceive('execute')
        ->once()
        ->with(Mockery::on(fn (ScanVolumeDTO $dto) => $dto->isbn === 'SUCCESS'))
        ->andReturn($volumeSuccess);

    $action = new AddBulkScannedVolumesAction($addScannedMangaAction);
    $dto = new ScanBulkVolumeDTO(userId: 1, isbns: ['FAIL', 'SUCCESS']);

    $results = $action->execute($dto);

    expect($results)->toHaveCount(1)
        ->and($results[0])->toBe($volumeSuccess);
});
