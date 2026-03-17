<?php

namespace Tests\PHPStan;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * @implements Rule<Node\Stmt\Class_>
 */
class RepositoryHasTestRule implements Rule
{
    public function getNodeType(): string
    {
        return Node\Stmt\Class_::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (! isset($node->namespacedName)) {
            return [];
        }

        $className = $node->namespacedName->toString();

        // Target only classes in Infrastructure\Repositories namespaces
        if (! preg_match('/^App\\\\[^\\\\]+\\\\Infrastructure\\\\Repositories\\\\(.+)$/', $className, $matches)) {
            return [];
        }

        $file = $scope->getFile();
        $rootDir = realpath(__DIR__.'/../../') ?: '';

        // Convert /Users/.../app/... to app/...
        $relativePath = str_contains($file, '/app/')
            ? 'app/'.explode('/app/', $file)[1]
            : $file;

        // Determine expected test path
        $testRelativePath = str_replace('app/', 'tests/Unit/', $relativePath);
        $testRelativePath = str_replace('.php', 'Test.php', $testRelativePath);

        $fullTestPath = rtrim($rootDir, '/').'/'.ltrim($testRelativePath, '/');

        if (! file_exists($fullTestPath)) {
            return [
                RuleErrorBuilder::message(
                    sprintf(
                        "Architecture rule violation: The repository class '%s' does not have a corresponding test file. Expected test file: %s",
                        $className,
                        $testRelativePath
                    )
                )
                    ->identifier('architecture.missingRepositoryTest')
                    ->build(),
            ];
        }

        return [];
    }
}
