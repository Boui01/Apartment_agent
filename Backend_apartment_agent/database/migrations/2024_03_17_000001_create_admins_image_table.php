<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admins_image', function (Blueprint $table) {
            $table->increments('id_admin_image');
            $table->string('admin_card_id')->nullable(); // Add the column first
            $table->foreign('admin_card_id')->references('id_card')->on('admins')->onDelete('set null');
            $table->binary('image');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
        
        $imageDirectory = public_path('Image/Unknown_person.jpg');
        $images = File::get($imageDirectory);

        DB::table('admins_image')->insert([
            'id_admin_image' => 1,
            'admin_card_id' => 1,
            'image' => $images,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins_image');
    }
};