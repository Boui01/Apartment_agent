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
        Schema::create('apartment_services', function (Blueprint $table) {
            $table->increments('id_apartment_service');
            $table->unsignedInteger('apartment_id')->nullable();
            $table->unsignedInteger('service_id')->nullable(); // Add the column first
            $table->foreign('apartment_id')->references('id_apartment')->on('apartments')->onDelete('set null');
            $table->foreign('service_id')->references('id_service')->on('services')->onDelete('set null');
            $table->timestamps(); // This will create 'created_at' and 'updated_at' columns with nullable timestamps
            $table->softDeletes(); // This will create a 'deleted_at' column with nullable timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apartment_services');
    }
};