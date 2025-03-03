function DatacreateChart( data_chart , spacify_value , setLanguage){
    console.log( 'data_chart : ' , data_chart)
    const today = new Date()
    const data = 
    setLanguage === "TH" ?
    [
        { name: 'มกราคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 0)).length 
                        ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 0)).length 
        },
        { name: 'กุมภาพันธ์', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 1)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 1)).length 
        },
        { name: 'มีนาคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 2)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 2)).length 
        },
        { name: 'เมษายน', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 3)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 3)).length 
        },
        { name: 'พฤษภาคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 4)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 4)).length 
        },
        { name: 'มิถุนายน', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 5)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 5)).length 
        },
        { name: 'กรกฎาคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 6)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 6)).length 
        },
        { name: 'สิงหาคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 7)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 7)).length 
        },
        { name: 'กันยายน', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 8)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 8)).length 
        },
        { name: 'ตุลาคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 9)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 9)).length 
        },
        { name: 'พฤศจิกายน', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 10)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 10)).length 
        },
        { name: 'ธันวาคม', 'ปีปัจจุบัน': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 11)).length 
                         ,  'ปีก่อนหน้า': data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 11)).length 
        },
    ]
    :
    [
        { name: 'Jan', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 0)).length 
                    ,  previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 0)).length 
        },
        { name: 'Feb', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 1)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 1)).length 
        },
        { name: 'Mar', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 2)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 2)).length 
        },
        { name: 'Apr', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 3)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 3)).length 
        }, 
        { name: 'May', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 4)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 4)).length 
        },
        { name: 'Jun', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 5)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 5)).length 
        },
        { name: 'Jul', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 6)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 6)).length 
        },
        { name: 'Aug', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 7)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 7)).length 
  
        },
        { name: 'Sep', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 8)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 8)).length 
  
        },
        { name: 'Oct', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 9)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 9)).length 
  
        },
        { name: 'Nov', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 10)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 10)).length 
  
        },
        { name: 'Dec', current_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear() && new Date( p[spacify_value] ).getMonth() === 11)).length 
                    , previous_year: data_chart.filter( p =>  (new Date( p[spacify_value] ).getFullYear() === today.getFullYear()-1 && new Date( p[spacify_value] ).getMonth() === 11)).length 
        },
    ];

    return data
}

export default DatacreateChart