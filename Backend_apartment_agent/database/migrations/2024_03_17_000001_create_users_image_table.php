<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users_image', function (Blueprint $table) {
            $table->increments('id_user_image');
            $table->string('user_card_id')->nullable(); // Add the column first
            $table->foreign('user_card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->binary('image');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_image');
    }
};
