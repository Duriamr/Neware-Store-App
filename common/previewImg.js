export default function previewImg(index,imgs){
	uni.previewImage({
		current:index,
		urls:imgs
	})
}