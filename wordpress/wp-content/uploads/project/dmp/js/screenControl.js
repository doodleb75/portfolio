// 스크린을 상단으로 이동
function screenMoveTop(){
	window.scrollTo(0,0) ;
}
function setOverflow(){
	document.body.style.overflow='hidden';
}
function popupWindow(){
	screenMoveTop();
	setOverflow();
}