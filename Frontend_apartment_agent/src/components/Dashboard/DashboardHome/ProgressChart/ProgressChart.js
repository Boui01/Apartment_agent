import './ProgressChart.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,   ScatterChart, Scatter, Pie, PieChart, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useState } from 'react';

function ProgressChart ( {data , percentage_day , percentage_month , percentage_year , title , setLanguage} ) {
    const height = 300
    const color_py = '#dfd2a1';
    const color_cy = '#5c9cbc';
    const [count_page_graph , setCount_page_graph] =  useState(0) 
    const [nextCssPage , setNextCssPage] =  useState(0)
    const COLORS_cercle = ['#7eb4ca', '#85ca7e', '#dfd2a1', '#bcbcbc'];

    const handlePageCss = () => {
        if(count_page_graph === 0){
            setNextCssPage(1)

            setTimeout(() => {
                setNextCssPage(3)
                setCount_page_graph(1)
            }, 500)
        }else{
            setNextCssPage(2)

            setTimeout(() => {
                setNextCssPage(0)
                setCount_page_graph(count_page_graph - 1)
            }, 500)
        }

    }

    return(
        <div className="block-chart-dashboard row text-center d_slide_next_2">
            <div className="block-chart-main-dashboard-cercle">
                <div className="col-8 mt-5 text-center block-chart-dashboard-cercle">
                    <ResponsiveContainer width="100%" height={height+80}>
                        <h3 className='text-secondary'>{title} {setLanguage === 'TH' ? 'ในปีนี้' : 'in This year'}</h3>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={'90%'}
                                fill={`${color_cy}`}
                                dataKey={ setLanguage === "TH" ? "ปีปัจจุบัน" : "current_year"}
                                >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_cercle[index % COLORS_cercle.length]}/>
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="row col-2 text-center mt-5 block-chart-dashboard-cercle">
                    <div className="">
                        <CircularProgressbar value={percentage_day} text={`${percentage_day}%`} className="progress-cercle-dashboard"/>
                        <p>{title} {setLanguage === 'TH' ? 'ในวันนี้' : 'Day'}</p>
                    </div>
                    <div className="">
                        <CircularProgressbar value={percentage_month} text={`${percentage_month}%`} className="progress-cercle-dashboard"/>
                        <p>{title} {setLanguage === 'TH' ? 'ในเดือนนี้' : 'Month'}</p>
                    </div>
                    <div className="">
                        <CircularProgressbar value={percentage_year} text={`${percentage_year}%`} className="progress-cercle-dashboard"/>
                        <p>{title} {setLanguage === 'TH' ? 'ในปีนี้' : 'Year'}</p>
                    </div>
                </div>
            </div>

            <div className={`row block-chart-dashboard-graph mt-5 `}>
                { count_page_graph === 0 ?
                    <>
                        <div className={`col-7 custom-dashboard-graph ${nextCssPage === 1 ? 'd_slide_next' : 'd_slide_back_2'}`}>
                            <ResponsiveContainer width="100%" height={height}>
                            <BarChart
                                data={data}
                                margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={ setLanguage === "TH" ? "ปีปัจจุบัน" : "current_year"} fill={`${color_cy}`} />
                                <Bar dataKey={ setLanguage === "TH" ? "ปีก่อนหน้า" : "previous_year"} fill={`${color_py}`} />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={`col-5 custom-dashboard-graph ${nextCssPage === 1 ? 'd_slide_next' : 'd_slide_back_2'}`}>
                            <ResponsiveContainer width="100%" height={height}>
                            <LineChart
                                data={data}
                                margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line dataKey={ setLanguage === "TH" ? "ปีปัจจุบัน" : "current_year"} fill={`${color_cy}`} />
                                <Line dataKey={ setLanguage === "TH" ? "ปีก่อนหน้า" : "previous_year"} fill={`${color_py}`} />
                            </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <button className='btn btn-secondary mx-2 custom-btn-progress-chart' onClick={() => handlePageCss()} disabled={nextCssPage === 2 }>{ setLanguage === 'TH' ? 'ถัดไป' : 'Next'}</button>
                    </>
                :
                    <>
                        <div className={`col-7 custom-dashboard-graph ${nextCssPage === 2 ? 'd_slide_back' : 'd_slide_next_2'}`}>
                            <ResponsiveContainer  width="100%" height={height}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis dataKey="name" name="X-axis" />
                                    <YAxis dataKey={ setLanguage === "TH" ? "ปีปัจจุบัน" : "current_year"} name="Y-axis" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
                                    <Scatter name="ปีปัจจุบัน" data={data} fill={`${color_cy}`} />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={`col-5 custom-dashboard-graph ${nextCssPage === 2 ? 'd_slide_back' : 'd_slide_next_2'}`}>
                            <ResponsiveContainer  width="100%" height={height}>
                                <RadarChart data={data}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis/>
                                    <Radar dataKey={ setLanguage === "TH" ? "ปีปัจจุบัน" : "current_year"} stroke={`${color_cy}`} fill={`${color_cy}`} fillOpacity={0.6} />
                                    <Radar dataKey={ setLanguage === "TH" ? "ปีก่อนหน้า" : "previous_year"} stroke={`${color_cy}`} fill={`${color_py}`} fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <button className='btn btn-secondary mx-2' onClick={() => handlePageCss()} disabled={nextCssPage === 1}>{ setLanguage === 'TH' ? 'กลับ' : 'Back'}</button>
                    </>
                }
            </div>
        </div>
    )
}

export default ProgressChart