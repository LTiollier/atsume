<?php

namespace App\Http\Api\Resources;

use App\Borrowing\Domain\Models\Loan;
use App\Manga\Domain\Models\Box;
use App\Manga\Domain\Models\Volume;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read Loan $resource
 */
class LoanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $loanableResource = null;
        $loanable = $this->resource->getLoanable();

        if ($loanable instanceof Volume) {
            $loanableResource = new MangaResource($loanable);
        } elseif ($loanable instanceof Box) {
            $loanableResource = new BoxResource($loanable);
        }

        return [
            'id' => $this->resource->getId(),
            'loanable_id' => $this->resource->getLoanableId(),
            'loanable_type' => $this->resource->getLoanableType(),
            'borrower_name' => $this->resource->getBorrowerName(),
            'loaned_at' => $this->resource->getLoanedAt()->format('c'),
            'returned_at' => $this->resource->getReturnedAt()?->format('c'),
            'is_returned' => $this->resource->isReturned(),
            'notes' => $this->resource->getNotes(),
            'loanable' => $loanableResource,
        ];
    }
}
