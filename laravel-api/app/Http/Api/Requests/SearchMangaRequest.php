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
        ];
    }

    public function toDTO(): SearchMangaDTO
    {
        return new SearchMangaDTO(
            query: $this->string('query')->toString()
        );
    }
}
