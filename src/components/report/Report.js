import { Card } from 'antd'
import React, { useEffect, useRef } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import * as echarts from 'echarts/core';
// Import bar charts, all suffixed with Chart
import { BarChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';


// Register the required components
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);


/* ------------------- breadcrum list ------------------- */
let breadCrum_list = [{
    id: 0,
    title: '首页',
    path: '/'
}, {
    id: 1,
    title: '数据统计',
    path: null
}, {
    id: 2,
    title: '数据报表',
    path: null
},
]

/* ------------------------------------------------------ */
/*                    REPORT COMPONENT                    */
/* ------------------------------------------------------ */
function Report() {
    const main = useRef(null)
    
    useEffect(()=>{
        var myChart = echarts.init(main.current);
        myChart.setOption({
            title: {
                text: 'ECharts Getting Started Example'
            },
            tooltip: {},
            xAxis: {
                data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
            },
            yAxis: {},
            series: [
                {
                    name: 'sales',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
            ]
        });
    },[])
   
  return (
    <div>
          <BreadCrumb list={breadCrum_list} />
          <Card>
            <div ref={main} style={{width:600, height:400}}></div>
          </Card>
    </div>
  )
}

export default Report