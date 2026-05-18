const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { authenticateToken } = require('../middlewares/auth');

/**
 * POST /api/upload/image
 * Upload 1 ảnh lên Cloudinary
 * Yêu cầu: đăng nhập (Bearer token)
 * Body: form-data với field "image"
 */
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file ảnh được gửi lên' });
    }

    return res.status(200).json({
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        url: req.file.path,           // URL ảnh trên Cloudinary
        public_id: req.file.filename, // ID để xóa ảnh sau này
      },
    });
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi upload ảnh' });
  }
});

/**
 * POST /api/upload/images
 * Upload nhiều ảnh cùng lúc (tối đa 10 ảnh)
 * Yêu cầu: đăng nhập (Bearer token)
 * Body: form-data với field "images"
 */
router.post('/images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có file ảnh được gửi lên' });
    }

    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    return res.status(200).json({
      success: true,
      message: `Upload ${req.files.length} ảnh thành công`,
      data: uploadedImages,
    });
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi upload ảnh' });
  }
});

/**
 * DELETE /api/upload/image/:publicId
 * Xóa ảnh khỏi Cloudinary theo public_id
 * Yêu cầu: đăng nhập (Bearer token)
 */
router.delete('/image/:publicId', authenticateToken, async (req, res) => {
  try {
    // public_id truyền qua param, dạng "milk-tea-store/abc123"
    const publicId = decodeURIComponent(req.params.publicId);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return res.status(200).json({ success: true, message: 'Xóa ảnh thành công' });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh để xóa' });
    }
  } catch (error) {
    console.error('Lỗi xóa ảnh:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xóa ảnh' });
  }
});

module.exports = router;
