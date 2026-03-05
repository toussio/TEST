const MAX_LEVEL = 50

// ===== 경험치 계산 =====
function xpNeed(level){
  return 100 + (level * 10)
}

// ===== 보상 리스트 =====
const rewards = [
{icon:"🐟",name:"츄르 박스",desc:"츄르 3~7개"},
{icon:"💰",name:"인게임 머니",desc:"50,000~150,000"},
{icon:"🪙",name:"후원코인",desc:"5~10 코인"},
{icon:"🎟️",name:"룰렛 티켓",desc:"룰렛 1회"},
{icon:"🧰",name:"강화 재료",desc:"재료 10개"},
{icon:"🚗",name:"튜닝 쿠폰",desc:"튜닝 할인"},
{icon:"👕",name:"의상 박스",desc:"랜덤 의상"},
{icon:"💎",name:"프리미엄 재화",desc:"1~3개"},
{icon:"🧪",name:"부스터",desc:"30분 경험치"},
{icon:"✨",name:"패스 경험치",desc:"+200XP"}
]

// ===== 상태 =====
let state = {
level:1,
xp:0,
gold:false,
freeClaim:{},
goldClaim:{}
}

// ===== UI =====
const uiLevel = document.getElementById("uiLevel")
const uiXp = document.getElementById("uiXp")
const uiNeed = document.getElementById("uiNeed")
const uiBar = document.getElementById("uiBar")

const freeTrack = document.getElementById("freeTrack")
const goldTrack = document.getElementById("goldTrack")

const toast = document.getElementById("toast")

// ===== 토스트 =====
function showToast(text){
toast.textContent=text
toast.classList.add("show")
setTimeout(()=>{
toast.classList.remove("show")
},1500)
}

// ===== 레벨업 =====
function addXp(amount){

state.xp += amount

while(state.xp >= xpNeed(state.level) && state.level < MAX_LEVEL){

state.xp -= xpNeed(state.level)
state.level++

showToast("레벨업! LV."+state.level)

}

render()
}

// ===== 보상 가져오기 =====
function getReward(level,type){

if(type==="gold" && level===50){
return {icon:"👑",name:"후원 스킨",desc:"프리미엄 스킨"}
}

if(type==="free" && level===50){
return {icon:"🏆",name:"머니 박스",desc:"1,000,000"}
}

return rewards[(level-1)%rewards.length]

}

// ===== 보상 수령 =====
function claim(level,type){

if(state.level < level){
showToast("레벨 부족")
return
}

if(type==="gold" && !state.gold){
showToast("골드 패스 필요")
return
}

let map = type==="gold" ? state.goldClaim : state.freeClaim

if(map[level]){
showToast("이미 수령함")
return
}

map[level]=true

showToast("보상 수령!")

render()

}

// ===== 카드 생성 =====
function createCard(level,type){

const reward = getReward(level,type)

const card = document.createElement("div")

let unlocked = state.level >= level

card.className="card " + (unlocked?"unlocked":"locked")

const lock = unlocked ? "🔓" : "🔒"

card.innerHTML=`

<div class="lock">${lock}</div>

<div class="lvl">LV.${level}</div>

<div class="reward">
<div class="icon">${reward.icon}</div>
<div>
<div class="name">${reward.name}</div>
<div class="desc">${reward.desc}</div>
</div>
</div>

<div class="actions">
<button class="small">받기</button>
</div>

`

const btn = card.querySelector("button")

btn.onclick = ()=> claim(level,type)

if(!unlocked) btn.disabled=true

if(type==="gold" && !state.gold) btn.disabled=true

return card

}

// ===== 렌더 =====
function render(){

uiLevel.textContent = state.level
uiXp.textContent = state.xp
uiNeed.textContent = xpNeed(state.level)

let percent = (state.xp/xpNeed(state.level))*100
uiBar.style.width = percent+"%"

freeTrack.innerHTML=""
goldTrack.innerHTML=""

for(let i=1;i<=MAX_LEVEL;i++){

freeTrack.appendChild(createCard(i,"free"))
goldTrack.appendChild(createCard(i,"gold"))

}

}

// ===== 버튼 =====
document.getElementById("btnAddXp10").onclick = ()=>addXp(10)
document.getElementById("btnAddXp50").onclick = ()=>addXp(50)
document.getElementById("btnAddXp200").onclick = ()=>addXp(200)

document.getElementById("btnReset").onclick = ()=>{

state={
level:1,
xp:0,
gold:false,
freeClaim:{},
goldClaim:{}
}

render()

}

document.getElementById("toggleGold").onchange = function(){

state.gold = this.checked
render()

}

// ===== 시작 =====
render()
