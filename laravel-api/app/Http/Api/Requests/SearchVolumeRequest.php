<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\Manga\Application\DTOs\SearchVolumeDTO;
use Illuminate\Foundation\Http\FormRequest;

class SearchVolumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'query' => ['required', 'string', 'min:3'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function toDTO(): SearchVolumeDTO
    {
        return new SearchVolumeDTO(
            query: $this->string('query')->toString(),
            page: $this->integer('page', 1),
            perPage: $this->integer('per_page', 15),
            userId: $this->user()?->id,
        );
    }
}
