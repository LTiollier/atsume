<?php

namespace App\Manga\Domain\Models;

class Box
{
    /**
     * @param  Volume[]  $volumes
     */
    public function __construct(
        private readonly int $id,
        private readonly int $box_set_id,
        private readonly string $title,
        private readonly ?string $number,
        private readonly ?string $isbn,
        private readonly ?string $api_id,
        private readonly ?string $release_date,
        private readonly ?string $cover_url,
        private readonly bool $is_empty,
        private readonly ?bool $is_owned = null,
        private readonly array $volumes = [],
    ) {}

    /**
     * @return Volume[]
     */
    public function getVolumes(): array
    {
        return $this->volumes;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getBoxSetId(): int
    {
        return $this->box_set_id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getNumber(): ?string
    {
        return $this->number;
    }

    public function getIsbn(): ?string
    {
        return $this->isbn;
    }

    public function getApiId(): ?string
    {
        return $this->api_id;
    }

    public function getReleaseDate(): ?string
    {
        return $this->release_date;
    }

    public function getCoverUrl(): ?string
    {
        return $this->cover_url;
    }

    public function isEmpty(): bool
    {
        return $this->is_empty;
    }

    public function isOwned(): ?bool
    {
        return $this->is_owned;
    }
}
