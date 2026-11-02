<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== USERS IN SQLITE DATABASE ===\n";
$users = User::all();
echo "Total Users: " . $users->count() . "\n";
foreach ($users as $u) {
    echo "- ID: {$u->id} | Name: {$u->name} | Email: {$u->email} | Role: {$u->role}\n";
}

echo "\n=== TABLES IN SQLITE ===\n";
$tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
foreach ($tables as $t) {
    $count = DB::table($t->name)->count();
    echo "- Table: {$t->name} ({$count} rows)\n";
}
