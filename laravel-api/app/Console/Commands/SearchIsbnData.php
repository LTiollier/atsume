<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use MongoDB\Laravel\Connection;

class SearchIsbnData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'isbn:search {query : The ISBN or title to search for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search ISBN data from MongoDB';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $query = $this->argument('query');
        /** @var Connection $mongoConnection */
        $mongoConnection = DB::connection('mongodb');
        $collection = $mongoConnection->getCollection('isbn_data');

        // Search by ISBN (exact) or Title (regex)
        $filter = [
            '$or' => [
                ['isbn' => $query],
                ['title' => ['$regex' => $query, '$options' => 'i']],
            ],
        ];

        $cursor = $collection->find($filter, [
            'limit' => 10,
            'projection' => [
                'isbn' => 1,
                'title' => 1,
                'editeur' => 1,
                'nb_page' => 1,
            ],
        ]);

        $results = iterator_to_array($cursor);

        if (empty($results)) {
            $this->info("No results found for '{$query}'.");

            return 0;
        }

        $this->table(
            ['ISBN', 'Title', 'Publisher', 'Pages'],
            array_map(function ($r) {
                $r = (array) $r;

                /** @var array<string, mixed> $r */
                return [
                    is_string($r['isbn'] ?? null) ? $r['isbn'] : 'N/A',
                    is_string($r['title'] ?? null) ? $r['title'] : 'N/A',
                    is_string($r['editeur'] ?? null) ? $r['editeur'] : 'N/A',
                    is_scalar($r['nb_page'] ?? null) ? (string) $r['nb_page'] : 'N/A',
                ];
            }, $results)
        );

        return 0;
    }
}
