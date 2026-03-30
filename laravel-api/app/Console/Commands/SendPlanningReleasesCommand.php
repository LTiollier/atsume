<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Mail\PlanningReleasesMail;
use App\Manga\Application\Actions\ListPlanningAction;
use App\Manga\Application\DTOs\PlanningFiltersDTO;
use App\Providers\AppServiceProvider;
use App\User\Infrastructure\EloquentModels\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

final class SendPlanningReleasesCommand extends Command
{
    protected $signature = 'planning:send-releases
                            {--dry-run : Log without sending emails}';

    protected $description = 'Send upcoming planning release notifications to subscribed users';

    public function handle(ListPlanningAction $listPlanningAction): int
    {
        $isDryRun = $this->option('dry-run');
        $from = now()->toDateString();
        $to = now()->addDays(7)->toDateString();

        $users = User::where('notify_planning_releases', true)
            ->whereNotNull('email_verified_at')
            ->cursor();

        $sent = 0;
        $skipped = 0;

        foreach ($users as $user) {
            $result = $listPlanningAction->execute(new PlanningFiltersDTO(
                userId: $user->id,
                from: $from,
                to: $to,
                perPage: 50,
                cursor: null,
            ));

            if ($result->getItems() === []) {
                $skipped++;

                continue;
            }

            if ($isDryRun) {
                $this->line("  [dry-run] Would send {$user->email} — {$result->getTotal()} release(s)");
                $sent++;

                continue;
            }

            $accentColor = AppServiceProvider::paletteHex($user->palette ?? 'oni');

            /** @var string $frontendUrl */
            $frontendUrl = config('app.frontend_url');

            Mail::to($user->email)->send(new PlanningReleasesMail(
                userName: $user->name,
                releases: $result->getItems(),
                accentColor: $accentColor,
                unsubscribeUrl: $frontendUrl.'/settings',
            ));

            $sent++;
        }

        $this->info("planning:send-releases — sent: {$sent}, skipped (no releases): {$skipped}");

        return self::SUCCESS;
    }
}
