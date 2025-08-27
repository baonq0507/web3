<template>
  <div class="kyc-detail">
    <div class="page-header">
      <a-button @click="goBack" style="margin-right: 16px">
        <template #icon><ArrowLeftOutlined /></template>
        Quay lại
      </a-button>
      <h1>Chi tiết KYC</h1>
      <a-space v-if="kycInfo.status === 'PENDING'">
        <a-button type="primary" @click="approveKYC">
          <template #icon><CheckOutlined /></template>
          Duyệt KYC
        </a-button>
        <a-button danger @click="showRejectModal = true">
          <template #icon><CloseOutlined /></template>
          Từ chối KYC
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="16">
        <a-card title="Thông tin cơ bản" style="margin-bottom: 24px">
          <a-descriptions :column="2">
            <a-descriptions-item label="ID KYC">
              {{ kycInfo.id }}
            </a-descriptions-item>
            <a-descriptions-item label="Trạng thái">
              <a-tag :color="getStatusColor(kycInfo.status)">
                {{ getStatusText(kycInfo.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Loại KYC">
              <a-tag :color="getTypeColor(kycInfo.type)">
                {{ getTypeText(kycInfo.type) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Độ ưu tiên">
              <a-tag :color="getPriorityColor(kycInfo.priority)">
                {{ getPriorityText(kycInfo.priority) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Ngày nộp">
              {{ formatDate(kycInfo.submittedAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="Ngày cập nhật cuối">
              {{ formatDate(kycInfo.updatedAt) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Thông tin cá nhân" style="margin-bottom: 24px">
          <a-descriptions :column="2">
            <a-descriptions-item label="Họ và tên">
              {{ kycInfo.fullName }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              {{ kycInfo.email }}
            </a-descriptions-item>
            <a-descriptions-item label="Số điện thoại">
              {{ kycInfo.phone }}
            </a-descriptions-item>
            <a-descriptions-item label="Ngày sinh">
              {{ formatDate(kycInfo.dateOfBirth) }}
            </a-descriptions-item>
            <a-descriptions-item label="Giới tính">
              {{ kycInfo.gender === 'MALE' ? 'Nam' : 'Nữ' }}
            </a-descriptions-item>
            <a-descriptions-item label="Quốc tịch">
              {{ kycInfo.nationality }}
            </a-descriptions-item>
            <a-descriptions-item label="Địa chỉ" :span="2">
              {{ kycInfo.address }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Tài liệu đính kèm" style="margin-bottom: 24px">
          <a-row :gutter="16">
            <a-col :span="8" v-for="document in kycInfo.documents" :key="document.id">
              <a-card size="small" hoverable @click="viewDocument(document)">
                <template #cover>
                  <img :src="document.thumbnail" :alt="document.name" />
                </template>
                <a-card-meta :title="document.name">
                  <template #description>
                    <div>{{ document.type }}</div>
                    <div>{{ formatDate(document.uploadedAt) }}</div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </a-card>

        <a-card title="Lịch sử xử lý">
          <a-timeline>
            <a-timeline-item v-for="log in kycLogs" :key="log.id">
              <template #dot>
                <a-avatar :size="24" :src="log.userAvatar" />
              </template>
              <div class="log-item">
                <div class="log-title">{{ log.action }}</div>
                <div class="log-time">{{ formatDate(log.timestamp) }}</div>
                <div class="log-user">Bởi: {{ log.userName }}</div>
                <div class="log-description" v-if="log.description">
                  {{ log.description }}
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="Thông tin bổ sung" style="margin-bottom: 24px">
          <a-descriptions :column="1">
            <a-descriptions-item label="Nghề nghiệp">
              {{ kycInfo.occupation }}
            </a-descriptions-item>
            <a-descriptions-item label="Nơi làm việc">
              {{ kycInfo.workplace }}
            </a-descriptions-item>
            <a-descriptions-item label="Thu nhập hàng tháng">
              {{ formatCurrency(kycInfo.monthlyIncome) }}
            </a-descriptions-item>
            <a-descriptions-item label="Nguồn tiền">
              {{ kycInfo.sourceOfFunds }}
            </a-descriptions-item>
            <a-descriptions-item label="Mục đích sử dụng">
              {{ kycInfo.purposeOfUse }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Hành động nhanh">
          <a-space direction="vertical" style="width: 100%">
            <a-button block @click="downloadDocuments">
              <template #icon><DownloadOutlined /></template>
              Tải tài liệu
            </a-button>
            <a-button block @click="sendEmail">
              <template #icon><MailOutlined /></template>
              Gửi email
            </a-button>
            <a-button block @click="addNote">
              <template #icon><EditOutlined /></template>
              Thêm ghi chú
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>

    <!-- Reject KYC Modal -->
    <a-modal
      v-model:open="showRejectModal"
      title="Từ chối KYC"
      @ok="confirmRejectKYC"
      @cancel="showRejectModal = false"
      okText="Từ chối"
      okType="danger"
    >
      <a-form layout="vertical">
        <a-form-item label="Lý do từ chối" required>
          <a-textarea
            v-model:value="rejectReason"
            :rows="4"
            placeholder="Nhập lý do từ chối..."
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Document Viewer Modal -->
    <a-modal
      v-model:open="showDocumentModal"
      :title="selectedDocument?.name"
      @cancel="showDocumentModal = false"
      width="800px"
      :footer="null"
    >
      <div class="document-viewer">
        <img 
          v-if="selectedDocument?.type === 'IMAGE'"
          :src="selectedDocument?.url" 
          style="width: 100%; height: auto;"
        />
        <iframe 
          v-else-if="selectedDocument?.type === 'PDF'"
          :src="selectedDocument?.url" 
          style="width: 100%; height: 500px; border: none;"
        />
        <div v-else class="document-placeholder">
          <a-icon type="file" style="font-size: 48px; color: #ccc;" />
          <p>Không thể xem trước tài liệu này</p>
          <a-button type="primary" @click="downloadDocument(selectedDocument)">
            Tải xuống
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  MailOutlined,
  EditOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// Data
const loading = ref(false)
const showRejectModal = ref(false)
const showDocumentModal = ref(false)
const rejectReason = ref('')
const selectedDocument = ref(null)

// KYC information
const kycInfo = reactive({
  id: 0,
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'MALE',
  nationality: '',
  address: '',
  type: 'INDIVIDUAL',
  status: 'PENDING',
  priority: 'MEDIUM',
  submittedAt: '',
  updatedAt: '',
  occupation: '',
  workplace: '',
  monthlyIncome: 0,
  sourceOfFunds: '',
  purposeOfUse: '',
  documents: []
})

// KYC logs
const kycLogs = ref([
  {
    id: 1,
    action: 'KYC được nộp',
    description: 'Người dùng đã nộp đầy đủ tài liệu',
    timestamp: '2024-01-15T10:30:00Z',
    userName: 'Nguyễn Văn A',
    userAvatar: ''
  },
  {
    id: 2,
    action: 'KYC được xem xét',
    description: 'Admin đã xem xét tài liệu',
    timestamp: '2024-01-15T14:20:00Z',
    userName: 'Admin User',
    userAvatar: ''
  }
])

// Methods
const fetchKYCInfo = async () => {
  loading.value = true
  try {
    const kycId = route.params.id
    // TODO: Replace with actual API call
    // const response = await kycApi.getKYCById(kycId)
    // Object.assign(kycInfo, response.data)

    // Mock data for now
    Object.assign(kycInfo, {
      id: kycId,
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      dateOfBirth: '1990-01-01',
      gender: 'MALE',
      nationality: 'Việt Nam',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      type: 'INDIVIDUAL',
      status: 'PENDING',
      priority: 'MEDIUM',
      submittedAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      occupation: 'Nhân viên văn phòng',
      workplace: 'Công ty ABC',
      monthlyIncome: 15000000,
      sourceOfFunds: 'Lương',
      purposeOfUse: 'Đầu tư',
      documents: [
        {
          id: 1,
          name: 'CMND/CCCD mặt trước',
          type: 'IMAGE',
          url: 'https://via.placeholder.com/300x200',
          thumbnail: 'https://via.placeholder.com/150x100',
          uploadedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'CMND/CCCD mặt sau',
          type: 'IMAGE',
          url: 'https://via.placeholder.com/300x200',
          thumbnail: 'https://via.placeholder.com/150x100',
          uploadedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 3,
          name: 'Sổ hộ khẩu',
          type: 'PDF',
          url: 'https://via.placeholder.com/300x200',
          thumbnail: 'https://via.placeholder.com/150x100',
          uploadedAt: '2024-01-15T10:30:00Z'
        }
      ]
    })
  } catch (error) {
    message.error('Không thể tải thông tin KYC')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/kyc')
}

const approveKYC = async () => {
  try {
    // TODO: Replace with actual API call
    // await kycApi.approveKYC(kycInfo.id)
    kycInfo.status = 'APPROVED'
    message.success('Đã duyệt KYC thành công')
    
    // Add log
    kycLogs.value.unshift({
      id: Date.now(),
      action: 'KYC được duyệt',
      description: 'Admin đã duyệt KYC',
      timestamp: new Date().toISOString(),
      userName: 'Admin User',
      userAvatar: ''
    })
  } catch (error) {
    message.error('Không thể duyệt KYC')
  }
}

const confirmRejectKYC = async () => {
  if (!rejectReason.value.trim()) {
    message.error('Vui lòng nhập lý do từ chối')
    return
  }

  try {
    // TODO: Replace with actual API call
    // await kycApi.rejectKYC(kycInfo.id, { reason: rejectReason.value })
    kycInfo.status = 'REJECTED'
    message.success('Đã từ chối KYC')
    showRejectModal.value = false
    
    // Add log
    kycLogs.value.unshift({
      id: Date.now(),
      action: 'KYC bị từ chối',
      description: `Lý do: ${rejectReason.value}`,
      timestamp: new Date().toISOString(),
      userName: 'Admin User',
      userAvatar: ''
    })
  } catch (error) {
    message.error('Không thể từ chối KYC')
  }
}

const viewDocument = (document: any) => {
  selectedDocument.value = document
  showDocumentModal.value = true
}

const downloadDocument = (document: any) => {
  // TODO: Implement download functionality
  message.info('Tính năng tải xuống đang được phát triển')
}

const downloadDocuments = () => {
  // TODO: Implement bulk download functionality
  message.info('Tính năng tải xuống đang được phát triển')
}

const sendEmail = () => {
  // TODO: Implement email functionality
  message.info('Tính năng gửi email đang được phát triển')
}

const addNote = () => {
  // TODO: Implement note functionality
  message.info('Tính năng thêm ghi chú đang được phát triển')
}

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'orange',
    APPROVED: 'green',
    REJECTED: 'red',
    EXPIRED: 'gray'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    EXPIRED: 'Hết hạn'
  }
  return texts[status] || status
}

const getTypeColor = (type: string) => {
  const colors = {
    INDIVIDUAL: 'blue',
    BUSINESS: 'purple'
  }
  return colors[type] || 'default'
}

const getTypeText = (type: string) => {
  const texts = {
    INDIVIDUAL: 'Cá nhân',
    BUSINESS: 'Doanh nghiệp'
  }
  return texts[type] || type
}

const getPriorityColor = (priority: string) => {
  const colors = {
    HIGH: 'red',
    MEDIUM: 'orange',
    LOW: 'green'
  }
  return colors[priority] || 'default'
}

const getPriorityText = (priority: string) => {
  const texts = {
    HIGH: 'Cao',
    MEDIUM: 'Trung bình',
    LOW: 'Thấp'
  }
  return texts[priority] || priority
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle
onMounted(() => {
  fetchKYCInfo()
})
</script>

<style scoped>
.kyc-detail {
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  flex: 1;
}

.log-item {
  margin-left: 16px;
}

.log-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.log-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.log-user {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.log-description {
  color: #666;
}

.document-viewer {
  text-align: center;
}

.document-placeholder {
  padding: 40px;
}

.document-placeholder p {
  margin: 16px 0;
  color: #666;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
