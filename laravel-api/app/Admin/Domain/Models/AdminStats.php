<?php

declare(strict_types=1);

namespace App\Admin\Domain\Models;

final class AdminStats
{
    public function __construct(
        private readonly int $newSeriesCount,
        private readonly int $newEditionsCount,
        private readonly int $newVolumesCount,
    ) {}

    public function getNewSeriesCount(): int
    {
        return $this->newSeriesCount;
    }

    public function getNewEditionsCount(): int
    {
        return $this->newEditionsCount;
    }

    public function getNewVolumesCount(): int
    {
        return $this->newVolumesCount;
    }

    /**
     * @return array<string, int>
     */
    public function toArray(): array
    {
        return [
            'new_series' => $this->newSeriesCount,
            'new_editions' => $this->newEditionsCount,
            'new_volumes' => $this->newVolumesCount,
        ];
    }
}
