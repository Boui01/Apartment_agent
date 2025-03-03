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
        Schema::create('remember_like_unlike', function (Blueprint $table) {
            $table->increments('id_remember_like_unlike');
            $table->string('card_id')->nullable(); // Add the column first
            $table->unsignedInteger('comment_id')->nullable(); // Add the column first
            $table->foreign('card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->foreign('comment_id')->references('id_comment')->on('comments')->onDelete('set null');
            $table->boolean('like');
            $table->boolean('unlike');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remember_like_unlike');
    }
};
