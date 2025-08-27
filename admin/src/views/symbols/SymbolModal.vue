<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? 'Chỉnh sửa Symbol' : 'Thêm Symbol mới' }}</h2>
        <button @click="closeModal" class="btn-close">
          <CloseOutlined />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name">Tên Symbol *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Nhập tên symbol..."
            :class="{ 'error': errors.name }"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="code">Code *</label>
          <input
            id="code"
            v-model="form.code"
            type="text"
            required
            placeholder="Nhập code symbol..."
            :class="{ 'error': errors.code }"
          />
          <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
        </div>

        <div class="form-group">
          <label for="image">Ảnh Symbol *</label>
          
          <!-- Upload ảnh -->
          <div class="image-upload-container">
            <div class="upload-area" @click="triggerFileInput" :class="{ 'has-image': form.image }">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileChange"
                style="display: none;"
              />
              
              <div v-if="!form.image" class="upload-placeholder">
                <UploadOutlined class="upload-icon" />
                <p>Click để chọn ảnh hoặc kéo thả ảnh vào đây</p>
                <p class="upload-hint">Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 5MB)</p>
              </div>
              
              <div v-else class="image-preview">
                <img :src="form.image" :alt="form.name || 'Symbol'" />
                <div class="image-overlay">
                  <button type="button" @click.stop="removeImage" class="btn-remove">
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Progress bar -->
            <div v-if="uploading" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ uploadProgress }}%</span>
            </div>
            
            <!-- Error message -->
            <span v-if="errors.image" class="error-message">{{ errors.image }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="sortOrder">Thứ tự</label>
            <input
              id="sortOrder"
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="form.isActive"
                type="checkbox"
              />
              <span class="checkmark"></span>
              Đang hoạt động
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="closeModal" class="btn-secondary">
            Hủy
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <LoadingOutlined v-if="loading" spin />
            {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { symbolsApi, type Symbol, type CreateSymbolDto } from '@/api/symbols';
import { uploadApi } from '@/api/upload';
import { CloseOutlined, LoadingOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';

// Props
interface Props {
  symbol?: Symbol | null;
  isEdit: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

// State
const loading = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement>();
const errors = reactive({
  name: '',
  code: '',
  image: ''
});

const form = reactive<CreateSymbolDto>({
  name: '',
  code: '',
  image: '',
  isActive: true,
  sortOrder: 0
});

// Methods
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errors.image = 'Chỉ chấp nhận file ảnh';
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.image = 'Kích thước file không được vượt quá 5MB';
    return;
  }
  
  try {
    uploading.value = true;
    uploadProgress.value = 0;
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
      }
    }, 100);
    
    const response = await uploadApi.uploadImage(file);
    
    clearInterval(progressInterval);
    uploadProgress.value = 100;
    
    form.image = response.data.url;
    errors.image = '';
    
    // Reset file input
    if (target) {
      target.value = '';
    }
    
  } catch (error: any) {
    console.error('Upload error:', error);
    errors.image = error.response?.data?.message || 'Lỗi upload ảnh';
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const removeImage = () => {
  form.image = '';
  errors.image = '';
};

const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Tên symbol là bắt buộc';
    isValid = false;
  } else if (form.name.trim().length < 2) {
    errors.name = 'Tên symbol phải có ít nhất 2 ký tự';
    isValid = false;
  }

  // Validate code
  if (!form.code.trim()) {
    errors.code = 'Code symbol là bắt buộc';
    isValid = false;
  } else if (form.code.trim().length < 2) {
    errors.code = 'Code symbol phải có ít nhất 2 ký tự';
    isValid = false;
  } else if (!/^[A-Z0-9]+$/.test(form.code.trim())) {
    errors.code = 'Code symbol chỉ được chứa chữ hoa và số';
    isValid = false;
  }

  // Validate image
  if (!form.image.trim()) {
    errors.image = 'Ảnh symbol là bắt buộc';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    if (props.isEdit && props.symbol) {
      await symbolsApi.updateSymbol(props.symbol._id, form);
    } else {
      await symbolsApi.createSymbol(form);
    }
    
    emit('saved');
  } catch (error: any) {
    console.error('Error saving symbol:', error);
    
    // Handle specific API errors
    if (error.response?.data?.message) {
      if (error.response.data.message.includes('name')) {
        errors.name = 'Tên symbol đã tồn tại';
      } else if (error.response.data.message.includes('code')) {
        errors.code = 'Code symbol đã tồn tại';
      } else {
        errors.name = error.response.data.message;
      }
    }
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const resetForm = () => {
  Object.assign(form, {
    name: '',
    code: '',
    image: '',
    isActive: true,
    sortOrder: 0
  });
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
};

// Watchers
watch(() => props.symbol, (newSymbol) => {
  if (newSymbol && props.isEdit) {
    Object.assign(form, {
      name: newSymbol.name,
      code: newSymbol.code,
      image: newSymbol.image,
      isActive: newSymbol.isActive,
      sortOrder: newSymbol.sortOrder
    });
  } else {
    resetForm();
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  if (props.symbol && props.isEdit) {
    Object.assign(form, {
      name: props.symbol.name,
      code: props.symbol.code,
      image: props.symbol.image,
      isActive: props.symbol.isActive,
      sortOrder: props.symbol.sortOrder
    });
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.btn-close:hover {
  color: #333;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="number"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}

.image-upload-container {
  margin-top: 10px;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.upload-area.has-image {
  border-style: solid;
  border-color: #007bff;
  padding: 0;
  overflow: hidden;
}

.upload-placeholder {
  color: #666;
}

.upload-icon {
  font-size: 32px;
  color: #ccc;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.btn-remove:hover {
  background: #c82333;
}

.upload-progress {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  display: block;
  text-align: center;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
