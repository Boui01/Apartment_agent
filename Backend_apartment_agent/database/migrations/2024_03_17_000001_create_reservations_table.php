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
        Schema::create('reservations', function (Blueprint $table) {
            $table->increments('id_reservation');
            $table->string('card_id')->nullable();
            $table->unsignedInteger('apartment_id')->nullable(); // Add the column first
            $table->foreign('apartment_id')->references('id_apartment')->on('apartments')->onDelete('set null');
            $table->foreign('card_id')->references('id_card')->on('users')->onDelete('set null');
            $table->timestamp('reservation_date');
            $table->integer('room');
            $table->integer('people');
            $table->string('other');
            $table->boolean('status');
            $table->date('rental_date');
            $table->string('objective_rental');
            $table->string('pet')->nullable();
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
