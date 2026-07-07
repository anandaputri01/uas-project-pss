<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateSwaggerDocs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'swagger:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate Swagger/OpenAPI documentation';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Suppress E_USER_WARNING dan E_USER_NOTICE dari swagger-php
        // agar tidak dikonversi menjadi ErrorException oleh Laravel
        $previousErrorHandler = set_error_handler(function (int $errno, string $errstr) use (&$previousErrorHandler): bool {
            if ($errno === E_USER_WARNING || $errno === E_USER_NOTICE) {
                // Log sebagai info saja, jangan throw exception
                $this->line("<comment>[swagger-php notice]</comment> {$errstr}");
                return true; // suppress
            }
            // Delegate ke handler sebelumnya untuk error lain
            if ($previousErrorHandler) {
                return (bool) ($previousErrorHandler)($errno, $errstr);
            }
            return false;
        });

        try {
            $this->info('Generating Swagger documentation...');
            $this->call('l5-swagger:generate');
            $this->info('✅ Swagger documentation generated successfully!');
            $this->info('📖 Buka: http://localhost:8000/api/documentation');
        } finally {
            // Restore error handler
            restore_error_handler();
        }

        return self::SUCCESS;
    }
}
