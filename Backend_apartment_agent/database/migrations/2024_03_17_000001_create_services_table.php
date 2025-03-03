<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->increments('id_service');
            $table->string('name');
            $table->string('thai_name');
            $table->timestamps();
        });

        // default service
        $list_service = [   ['Free filtered water', 'เครื่องกรองน้ำ'],
                            ['Gym', 'ยิม'],
                            ['Swimming Pool', 'สระว่ายน้ำ'],
                            ['Parking', 'ลานจอดรถ'], 
                            ['Free Laundry', 'เครื่องซักผ้า'], 
                            ['Free Internet', 'อินเตอร์เน็ต'], 
                            ['Parcel Delivery', 'จัดส่งพัสดุ'], 
                            ['Shuttle Service', 'รถรับส่ง'], 
                            ['Community Activities', 'กิจกรรมน่ารัก'],
                            ['Recreation Areas', 'พื้นที่กีฬา'],
                            ['Co-working Spaces', 'พื้นที่ทำงาน']
                        ];

        foreach($list_service as $service){
            if($service){
                DB::table('services')->insert([
                    'name' => $service[0],
                    'thai_name' => $service[1],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
        };
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};