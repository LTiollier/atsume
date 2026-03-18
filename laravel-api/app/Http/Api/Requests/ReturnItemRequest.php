<?php

namespace App\Http\Api\Requests;

use App\Borrowing\Application\DTOs\ReturnItemDTO;
use App\Manga\Infrastructure\EloquentModels\Box;
use App\Manga\Infrastructure\EloquentModels\Volume;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReturnItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        $id = $this->input('loanable_id');
        $type = $this->input('loanable_type');

        if (! $id || ! $type) {
            return false;
        }

        if ($type === 'volume') {
            $volume = Volume::find($id);

            return $volume && ($this->user()?->can('return', $volume) ?? false);
        }

        if ($type === 'box') {
            $box = Box::find($id);

            return $box && $this->user()?->boxes()->where('box_id', $id)->exists();
        }

        return false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'loanable_id' => 'required|integer',
            'loanable_type' => ['required', Rule::in(['volume', 'box'])],
        ];
    }

    public function toDTO(): ReturnItemDTO
    {
        $userId = $this->user()?->getAuthIdentifier();

        return new ReturnItemDTO(
            userId: is_numeric($userId) ? (int) $userId : 0,
            loanableId: $this->integer('loanable_id'),
            loanableType: $this->string('loanable_type')->toString(),
        );
    }
}
