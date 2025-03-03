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
        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id_comment');
            $table->string('description');
            $table->string('card_id')->nullable(); // Add the column first
            $table->unsignedInteger('apartment_id')->nullable(); // Add the column first
            $table->foreign('card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->foreign('apartment_id')->references('id_apartment')->on('apartments')->onDelete('set null');
            $table->integer('comment_like');
            $table->integer('comment_unlike');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
