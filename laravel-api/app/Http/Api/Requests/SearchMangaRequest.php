<?php

namespace App\Http\Api\Requests;

use App\Manga\Application\DTOs\SearchMangaDTO;
use Illuminate\Foundation\Http\FormRequest;

class SearchMangaRequest extends FormRequest
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

    public function toDTO(): SearchMangaDTO
    {
        return new SearchMangaDTO(
            query: $this->string('query')->toString(),
            page: $this->integer('page', 1),
            perPage: $this->integer('per_page', 15),
        );
    }
}
