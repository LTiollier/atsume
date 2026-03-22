<?php

declare(strict_types=1);

namespace App\Http\Api\Requests;

use App\Borrowing\Application\DTOs\BulkReturnItemDTO;
use App\Manga\Infrastructure\EloquentModels\Box;
use App\Manga\Infrastructure\EloquentModels\Volume;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkReturnItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var array<int, array{id: int, type: string}>|null $items */
        $items = $this->input('items');
        if (! is_array($items)) {
            return false;
        }

        foreach ($items as $item) {
            $id = $item['id'];
            $type = $item['type'];

            if ($type === 'volume') {
                $volume = Volume::find($id);
                if (! $volume || ! ($this->user()?->can('return', $volume) ?? false)) {
                    return false;
                }
            } elseif ($type === 'box') {
                $box = Box::find($id);
                if (! $box || ! $this->user()?->boxes()->where('box_id', $id)->exists()) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.type' => ['required', Rule::in(['volume', 'box'])],
        ];
    }

    public function toDTO(): BulkReturnItemDTO
    {
        $userId = $this->user()?->getAuthIdentifier();

        /** @var array<int, array{id: int, type: string}> $items */
        $items = $this->input('items');

        return new BulkReturnItemDTO(
            userId: is_numeric($userId) ? (int) $userId : 0,
            items: $items,
        );
    }
}
