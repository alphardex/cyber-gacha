import "./style.css";

import Experience from "./Experience/Experience";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="sketch"></div>
<div class="instruction">
    注：本游戏仅供娱乐~<br>点击右上角界面上的按钮即可游玩，金色的扭蛋为最高稀有度，出货概率参考了某原的概率，而且还去掉了保底机制<del>（其实是懒得做）</del>，这下欧非之间的差距就更加明显了:)<br>顺带一提如果池子满了，可以挥舞鼠标把多余的球球抖下去哦（只要别把金的抖掉），或者直接点击按钮一键清空（会保留你本次出金的记录）<br>如果觉得自己挺欧/挺非，欢迎截图分享~<br>扭蛋模型：https://sketchfab.com/3d-models/gachapon-ball-471a501039ae4758969137955c7e2ebd
</div>
<div class="loader-screen">
    <div class="loading-container">
        <div class="loading">
            <span style="--i: 0">L</span>
            <span style="--i: 1">O</span>
            <span style="--i: 2">A</span>
            <span style="--i: 3">D</span>
            <span style="--i: 4">I</span>
            <span style="--i: 5">N</span>
            <span style="--i: 6">G</span>
        </div>
    </div>
</div>
`;

new Experience("#sketch");
