<template>
	<view>
		<view class="circle_list" @tap.stop="toCircle(item.id,item.customerType)" :style="{borderBottom}">
			<view class="info">
				<view class="left" @tap.stop="toCirclePage(item.authorId)">
					<view class="avatar">
						<image class="avatar_img" :src="item.authorImage" />
						<image class="admin" src="/static/studyEnjoy/circle/admin.png" v-if="item.isAdmin" />
					</view>
					<view class="left_main">
						<view class="name">
							{{item.authorName}}
						</view>
						<view class="time">
							{{item.createTime}}
						</view>
					</view>
				</view>
				<view class="right">
					<block v-if="type=='recommend'||type=='topic'">
						<view class="look" v-if="oid!=item.authorId&&!item.isFollow" @tap.stop="addFollow(item.authorId)">
							<text>关注</text>
						</view>
						<view class="nolook" v-if="oid!=item.authorId&&item.isFollow" @tap.stop="cancelFollow(item.authorId)">
							<text>已关注</text>
						</view>
					</block>
					<image class="extend" src="/static/studyEnjoy/extend.png" @tap.stop="showExtend(index)" />
				</view>
			</view>
			
			<view class="extend_info" v-if="item.extend">
				<image class="arrow" mode="widthFix" src="/static/public/arrow/up.png" @tap.stop="showExtend(index)" />
				<view class="info_ul" >
					<view class="info_list" v-if="type=='follow'&&oid!=item.authorId&&item.isFollow" @tap.stop="cancelFollow(item.authorId)">
						取消关注
					</view>
					<view class="info_list" v-if="oid!=item.authorId" @tap.stop = "toReport(item.id)">
						举报此条
					</view>
					<view class="info_list" v-if="oid==item.authorId" @tap.stop="deleteArticle(item.id,index)">
						删除此条
					</view>
				</view>
			</view>
			
			<block v-if="item.customerType">
				<text class="text" v-if="item.content!=''&&item.content!=null&&item.content!=undefined">
					{{item.content}}
				</text>
				<text class="text" style="color: #999999;margin-top: 0" v-if="item.content.length > 58">查看全文</text>
			</block>
			
			<block v-if="!item.customerType">
				<text class="text" v-if="item.title!=''&&item.title!=null&&item.title!=undefined">
					{{item.title}}
				</text>
				<text class="text" style="color: #999999;margin-top: 0;">查看全文</text>
			</block>
			
			
			
			<view class="image_ul" :class="'img'+item.avatarImg.length" v-if="item.avatarImg.length>0&&item.avatarImg.length<10">
				<image :src="img" mode="aspectFill" v-for="(img,index2) in item.avatarImg" :key="'img'+index+index2" @tap.stop = "$previewImg(index2,item.avatarImg)" />
			</view>
			
			<view class="vote" v-if="item.articleVoteDto!=null&&item.articleVoteDto!={}&&$isObject(item.articleVoteDto)">
				<view class="vote_title">
					<text>{{item.articleVoteDto.title}}</text>
				</view>
				<view class="vote_ul" v-if="!item.articleVoteDto.isVote&&!item.articleVoteDto.isEnd">
					<block v-for="(item2,index2) in item.articleVoteDto.voteOptions" :key="'vote'+index+index2" v-if="index2<3">
						<view class="vote_list1" @tap.stop="addVote(item.id,item.articleVoteDto.id,item2.id,item.articleVoteDto.isEnd,item.articleVoteDto.userVoteNumber,item.articleVoteDto.maxSelectNumber)" >
							<text>{{item2.title}}</text>
						</view>
					</block>
					<view class="lookAll" style="color: #F8B500;" v-if="item.articleVoteDto.voteOptions.length>3">
						<text>查看全部选项</text>
						<image src="/static/public/go_yellow.png" />
					</view>
				</view>
				<view class="vote_ul" v-if="item.articleVoteDto.isVote||item.articleVoteDto.isEnd">
					<block v-for="(item2,index2) in item.articleVoteDto.voteOptions" :key="'vote'+index+index2" v-if="index2<3">
						<view class="vote_list2" v-if="!item2.isVote" @tap.stop="addVote(item.id,item.articleVoteDto.id,item2.id,item.articleVoteDto.isEnd,item.articleVoteDto.userVoteNumber,item.articleVoteDto.maxSelectNumber)">
							<view class="proportion" :style="{width:item2.proportion*100+'%'}"></view>
							<view class="main">
								<view class="left">
									<text>{{item2.title}}</text>
								</view>
								<view class="right">
									<text>{{item2.optionNumber}}票</text>
								</view>
							</view>
						</view>
						<view class="vote_list2 acitve" v-if="item2.isVote">
							<view class="proportion" :style="{width:item2.proportion*100+'%'}"></view>
							<view class="main">
								<view class="left">
									<text>{{item2.title}}</text>
									<image src="/static/studyEnjoy/circle/yes.png" />
								</view>
								<view class="right">
									<text>{{item2.optionNumber}}票</text>
								</view>
							</view>
						</view>
					</block>
					<view class="lookAll" style="color: #F8B500;" v-if="item.articleVoteDto.voteOptions.length>3">
						<text>查看全部选项</text>
						<image src="/static/public/go_yellow.png" />
					</view>
				</view>
				<view class="vote_bot">
					{{item.articleVoteDto.describe}}
				</view>
			</view>
			
			<view class="topic_content" v-if="type!='topic'&&item.lable!=null&&item.lable!=''">
				<view class="topic" @tap.stop="toTopic(item.publishingTypeId)">
					<view class="dot"></view>
					<text>{{item.lable}}</text>
				</view>
			</view>
			
			<view class="bot">
				<view class="left" >
					<!-- #ifdef APP-PLUS -->
					<view class="btn" @tap.stop="showShare(item.authorImage,item.id,item.customerType,item.content,item.title)">
						<image class="icon" src="/static/studyEnjoy/circle/share.png" />
						<text>分享</text>
					</view>
					<!-- #endif --> 
				</view>
				<view class="right">
					<view class="btn" @tap.stop="showComment(item.id,index)">
						<image class="icon" src="/static/studyEnjoy/circle/comment.png" />
						<text>{{item.commentCount}}</text>
					</view>
					<view class="btn">
						<image class="icon" src="/static/studyEnjoy/circle/favor.png" v-if="!item.isCollection" @tap.stop="addFavor(item.id,index)" />
						<image class="icon" src="/static/studyEnjoy/circle/favor_selected.png" v-if="item.isCollection" @tap.stop="cancelFavor(item.id,index)" />
						<text>{{item.collectionNumber}}</text>
					</view>
					<view class="btn">
						<image class="icon" src="/static/studyEnjoy/circle/point.png" v-if="!item.isPoint" @tap.stop="addPoint(item.id,index)" />
						<image class="icon" src="/static/studyEnjoy/circle/point_selected.png" v-if="item.isPoint" @tap.stop="cancelPoint(item.id,index)" />
						<text>{{item.pointNumber}}</text>
					</view>
				</view>
			</view>
			
			<view class="comment_ul" v-if="item.articleCommentResponseDtos !=null && item.articleCommentResponseDtos.length > 0">
				<view class="comment_list" v-for="(item2,index2) in item.articleCommentResponseDtos" :key="'comment'+index+''+index2">
					<text class="name">{{item2.fromNickName}}：</text>{{item2.content}}
				</view>
				<view class="comment_list" v-if="item.commentCount > 6">
					<text class="name yellow">更多</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			type:{
				type: String,
				default: 'recommend'
			},
			item:Object,
			index:{
				type: Number,
				default: 0
			},
			circleIdx:{
				type: Number,
				default: 0
			},
			oid:{
				type: Number,
				default: 0
			},
			token:{
				type: String,
				default: ''
			},
			borderBottom:{
				type: String,
				default: '16upx solid #F8F9FA'
			},
		},
		methods:{
			addFollow(){
				this.$emit("addFollow")
			},
			cancelFollow(){
				this.$emit("cancelFollow")
			},
			deleteArticle(){
				this.$emit("deleteArticle")
			},
			addFavor(){
				this.$emit("addFavor")
			},
			cancelFavor(){
				this.$emit("cancelFavor")
			},
			addPoint(){
				this.$emit("addPoint")
			},
			cancelPoint(){
				this.$emit("cancelPoint")
			},
			showExtend(){
				this.$emit("showExtend")
			},
			hideExtend(){
				this.$emit("hideExtend")
			},
			showComment(){
				this.$emit("showComment")
			},
			showShare(){
				this.$emit("showShare")
			},
			addVote(articleId,articleVoteId,optionId,isEnd,userVoteNumber,maxSelectNumber){
				this.hideExtend()
				// if(isEnd){
				// 	return false
				// }
				// if(userVoteNumber>=maxSelectNumber){
				// 	return false
				// }
				this.$emit("addVote",articleId,articleVoteId,optionId)
			},
			toReport(articleId){
				this.hideExtend()
				if(this.token==''||this.token==null||this.token==undefined){
					this.$to401()
					return false
				}
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/report/report?articleId="+articleId
				})
			},
			toCirclePage(authorId){
				this.hideExtend()
				// #ifdef H5
				this.$downNASA();
				return false;
				// #endif 
				if(this.type == 'personal'){
					return false
				}
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/circlePage/circlePage?authorId="+authorId
				})
			},
			toTopic(publishingTypeId){
				this.hideExtend()
				uni.navigateTo({
					url:"/pages/studyEnjoy/circle/topic/topic?publishingTypeId="+publishingTypeId
				})
			},
			toCircle(articleId,type){
				this.hideExtend()
				if(type){
					uni.navigateTo({
						url:"/pages/studyEnjoy/circle/circle?id="+articleId
					})
				}else{
					uni.navigateTo({
						url:"/pages/studyEnjoy/article/article?id="+articleId
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.circle_list{
		width: 100%;
		background: #FFFFFF;
		box-sizing: border-box;
		padding: 32upx;
		border-bottom: 16upx solid #F8F9FA;
		display: flex;
		flex-direction: column;
		position: relative;
		
		font-size: 28upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 28upx;
		.info{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left{
				display: flex;
				align-items: center;
				.avatar{
					width:80upx;
					height:80upx;
					border-radius: 100%;
					margin-right: 16upx;
					background-image: url(/static/my/avatar.png);
					background-size: 100% 100%;
					background-repeat: no-repeat;
					position: relative;
					.avatar_img{
						width:100%;
						height:100%;
						border-radius: 100%;
					}
					.admin{
						position: absolute;
						width:28upx;
						height:28upx;
						bottom: 4upx;
						right: -4upx;
					}
				}
				
				.left_main{
					display: flex;
					flex-direction: column;
					.name{
						font-family:PingFangSC-Medium,PingFang SC;
						font-weight:500;
						margin-bottom: 12upx;
					}
					.time{
						font-size:24upx;
						color:#B3B3B3;
						line-height:24upx;
					}
				}
			}
			.right{
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.look,
				.nolook{
					width: 112upx;
					height: 56upx;
					border-radius: 28upx;
					background: linear-gradient(315deg, #FC9900 0%, #F8B500 100%);
					font-size:24upx;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
					color: #FFFFFF;
					line-height:24upx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.nolook{
					background: #E5E5E5;
				}
				.extend{
					width: 40upx;
					height: 40upx;
					margin-left: 16upx;
				}
			}
		}
		.extend_info{
			position: absolute;
			right: 0;
			top: 70upx;
			z-index: 3;
			width: 192upx;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			.arrow{
				width: 104upx;
			}
			.info_ul{
				width: 100%;
				display: flex;
				flex-direction: column;
				box-shadow:0 0 24upx 0 rgba(0,0,0,0.08);
				background-color: #FFFFFF;
				border-radius:16upx;
				.info_list{
					width: 100%;
					height: 92upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
					text-shadow:0 0 24upx rgba(0,0,0,0.08);
					border-bottom: 1upx solid #F5F5F5;
					&:last-of-type{
						border-bottom: none;
					}
				}
			}
		}
		.text{
			margin-top: 24upx;
			font-size: 30upx;
			line-height:40upx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			letter-spacing:2upx
		}
		
		.image_ul{
			width: 100%;
			margin-top: 24upx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			image{
				display: block;
				border-radius:8upx;
			}
		}
		.img1{
			image{
				width: 100%;
				height: 412upx;
			}
		}
		.img2,
		.img4{
			justify-content: space-between;
			image{
				width: 336upx;
				height: 336upx;
				&:nth-of-type(3),
				&:nth-of-type(4){
					margin-top: 14upx;
				}
			}
		}
		.img3,
		.img5,
		.img6,
		.img7,
		.img8,
		.img9{
			image{
				width: 220upx;
				height: 220upx;
				margin-right: 13upx;
				&:nth-of-type(3),
				&:nth-of-type(6),
				&:nth-of-type(9){
					margin-right: 0;
				}
				&:nth-of-type(4),
				&:nth-of-type(5),
				&:nth-of-type(6),
				&:nth-of-type(7),
				&:nth-of-type(8),
				&:nth-of-type(9){
					margin-top: 13upx;
				}
			}
		}
		
		.vote{
			width: 100%;
			background: #F8F9FA;
			border-radius: 8upx;
			margin-top: 32upx;
			box-sizing: border-box;
			padding: 0 16upx;
			display: flex;
			flex-direction: column;
			.vote_title{
				font-size: 32upx;
				line-height: 32upx;
				padding: 24upx 0;
			}
			.vote_ul{
				width: 100%;
				display: flex;
				flex-direction: column;
				.vote_list1{
					width: 100%;
					height: 80upx;
					background: #FFFFFF;
					border-radius: 8upx;
					box-sizing: border-box;
					border: 1upx solid #E3E6E9;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 16upx;
					&:first-of-type{
						margin-top: 0;
					}
				}
				.vote_list2{
					width: 100%;
					height: 80upx;
					background: #FFFFFF;
					border-radius: 8upx;
					box-sizing: border-box;
					border: 1upx solid #E3E6E9;
					margin-top: 16upx;
					overflow: hidden;
					position: relative;
					.proportion{
						height: 100%;
						background: #E7E9EB;
					}
					.main{
						width: 100%;
						height: 100%;
						position: absolute;
						z-index: 2;
						top: 0;
						left: 0;
						box-sizing: border-box;
						padding: 0 24upx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.right{
							font-size: 24upx;
							color: #B3B3B3;
							line-height: 24upx;
						}
					}
					&.acitve{
						border: 1upx solid #F8B500;
						.proportion{
							background: rgba(248,181,0,0.3);
						}
						.main{
							color: #F8B500;
							.left{
								display: flex;
								align-items: center;
								image{
									margin-left: 8upx;
									width: 32upx;
									height: 32upx;
								}
							}
							.right{
								color: #F8B500;
							}
						}
					}
					&:first-of-type{
						margin-top: 0;
					}
				}
				.lookAll{
					width: 100%;
					height: 80upx;
					background: #FFFFFF;
					color: #F8B500;
					border-radius: 8upx;
					box-sizing: border-box;
					border: 1upx solid #E3E6E9;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 16upx;
					image{
						width: 18upx;
						height: 20upx;
					}
				}
			}
			.vote_bot{
				font-size: 24upx;
				color: #B3B3B3;
				line-height: 24upx;
				padding: 24upx 0;
			}
		}
		
		.topic_content{
			width: 100%;
			display: flex;
			margin-top: 32upx;
			.topic{
				font-size:24upx;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color: #F8B500;
				line-height:24upx;
				padding:10upx 12upx;
				background:rgba(245,245,245,1);
				border-radius:24upx;
				display: flex;
				align-items: center;
				.dot{
					width:16upx;
					height:16upx;
					background:rgba(248,181,0,0.35);
					border: 6upx solid #F8B500;
					margin-right: 12upx;
					border-radius: 100%;
				}
			}
		}
		
		.bot{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size:24upx;
			color:#666666;
			line-height:24upx;
			margin-top: 32upx;
			.icon{
				width: 40upx;
				height: 40upx;
				margin-right: 4upx;
			}
			.left{
				display: flex;
				align-items: center;
				.btn{
					display: flex;
					align-items: center;
					.icon{
						margin-right: 8upx;
					}
				}
			}
			.right{
				display: flex;
				align-items: center;
				.btn{
					display: flex;
					align-items: flex-end;
					margin-left: 64upx;
				}
			}
		}
		
		.comment_ul{
			width: 100%;
			background:#F8F9FA;
			box-sizing: border-box;
			padding: 16upx;
			border-radius:8upx;
			margin-top: 32upx;
			display: flex;
			flex-direction: column;
			.comment_list{
				width: 100%;
				line-height:34upx;
				color:#666666;
				margin-bottom: 20upx;
				&:last-of-type{
					margin-bottom: 0;
				}
				.name{
					color:#333333;
				}
				.yellow{
					color: #F8B500;
				}
			}
		}
	}
</style>
