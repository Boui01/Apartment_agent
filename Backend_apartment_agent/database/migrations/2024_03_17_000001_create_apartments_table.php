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

        Schema::create('apartments', function (Blueprint $table) {
            $table->increments('id_apartment');
            $table->string('card_id')->nullable();
            $table->foreign('card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->string('address');
            $table->string('name');
            $table->string('thai_name');
            $table->string('description');
            $table->string('thai_description');
            $table->integer('bedroom');
            $table->integer('bathroom');
            $table->boolean('pet');
            $table->string('rule');
            $table->integer('total_room');
            $table->integer('score');
            $table->integer('price');
            $table->boolean('status');
            $table->timestamps();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartments');
    }
};
