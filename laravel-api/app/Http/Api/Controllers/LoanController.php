<?php

declare(strict_types=1);

namespace App\Http\Api\Controllers;

use App\Borrowing\Application\Actions\BulkLoanVolumeAction;
use App\Borrowing\Application\Actions\BulkReturnItemAction;
use App\Borrowing\Application\Actions\ListLoansAction;
use App\Borrowing\Application\Actions\LoanItemAction;
use App\Borrowing\Application\Actions\ReturnItemAction;
use App\Http\Api\Requests\BulkLoanVolumeRequest;
use App\Http\Api\Requests\BulkReturnItemRequest;
use App\Http\Api\Requests\LoanItemRequest;
use App\Http\Api\Requests\ReturnItemRequest;
use App\Http\Api\Resources\LoanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LoanController
{
    public function index(Request $request, ListLoansAction $action): AnonymousResourceCollection
    {
        $loans = $action->execute((int) auth()->id());

        return LoanResource::collection($loans);
    }

    public function store(LoanItemRequest $request, LoanItemAction $action): JsonResponse
    {
        $dto = $request->toDTO();
        $loan = $action->execute($dto);

        return (new LoanResource($loan))->response()->setStatusCode(201);
    }

    public function bulkStore(BulkLoanVolumeRequest $request, BulkLoanVolumeAction $action): AnonymousResourceCollection
    {
        $dto = $request->toDTO();
        $loans = $action->execute($dto);

        return LoanResource::collection($loans);
    }

    public function return(ReturnItemRequest $request, ReturnItemAction $action): LoanResource
    {
        $dto = $request->toDTO();
        $loan = $action->execute($dto);

        return new LoanResource($loan);
    }

    public function bulkReturn(BulkReturnItemRequest $request, BulkReturnItemAction $action): AnonymousResourceCollection
    {
        $dto = $request->toDTO();
        $loans = $action->execute($dto);

        return LoanResource::collection($loans);
    }
}
