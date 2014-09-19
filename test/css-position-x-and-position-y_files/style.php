 

*{
	margin: 0px;
	padding: 0px;
}

	body, html{
		width: 100%;
		height: 100%;

	}

body{
	font-family:Gill Sans,sans-serif;
	background: #2a2a2a;	
}

#wrap{
	width: 100%;
	height: 100%;
	min-width: 1000px;
}

#head{
height:156px;
position:fixed;
width:100%;
top: 0px;
}

#main{
	padding-top:148px;
}

#logo{
	background-image:url(images/logo.png);
	background-position:0 0;
	height:108px;
	left:50px;
	position:absolute;
	top:26px;
	width:90px;
}

#return{
	color:#FAC500;
	font-size:13px;
	position:absolute;
	right:50px;
	text-decoration:none;
	top:122px;
} 
#return:hover{
	color: #fff;
}

img, a{
	outline: none;
}

h1{
	color:#FFFFFF;
	font-family:Helvetica,"Helvetica Neue",Arial,sans-serif;
	font-size:18px;
	font-weight:normal;
	letter-spacing:-1px;
	position:absolute;
	right:50px;
	text-shadow:2px 2px 0 #111111;
	top:95px;
}

.hr{
	border-top:1px dashed #555555;
	height:1px;
	position:absolute;
	top:153px;
	width:100%;
}


.TabHolder{
	height: 26px;
	width: auto;
	position: fixed;
	z-index: 100000;
}

.leftTab, .rightTab{
	display: inline-block;
	width: 17px;
	background-image: url("images/leftTabDarker.png");
	height: 26px;
	margin: 0px;
	float: left;
}

.rightTab{
		background-image: url("images/rightTabDarker.png");
}

.midTab{
	display: inline-block;
	width: 17px;
	background-image: url("images/midTabDarker.png");
	height: 26px;
	margin: 0px;
	min-width: 200px;
	width: auto;
	float: left;
	font-size: 11px;
	font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
	line-height: 23px;
	text-shadow: 1px 1px 0px #fff;
	padding: 0px 2px;
}

.midTab .midTabcol{
	text-decoration: none;
	color: #444;
	border-right: 1px solid #999;
	border-left: 1px solid #fff;
	padding: 0px 10px;
	display: inline-block;
	line-height: 12px;
}

.midTab .midTabcol:first-child{
	border-left: 0px;
}

.midTab .midTabcol:last-child, .midTab .lastmidTabcol{
	border-right: 0px;
}

.midTab a:hover{
	 color: #111;
}

.midTab a:focus{
	 position: relative;
	 top: 1px;
}

.goodBrowsers{
		display:inline-block;
 		position: relative;
	 	top: 3px;
}

#footerTab{
	bottom: 0px;
	right: 100px;
	bottom: -27px;
}
 

