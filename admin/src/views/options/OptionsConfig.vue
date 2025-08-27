<template>
  <div class="options-config">
    <div class="page-header">
      <h1>Cấu hình Options</h1>
      <a-space>
        <a-button @click="saveAllConfigs">
          <template #icon><SaveOutlined /></template>
          Lưu tất cả
        </a-button>
        <a-button type="primary" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="Cấu hình chung" style="margin-bottom: 24px">
          <a-form layout="vertical">
            <a-form-item label="Trạng thái Options">
              <a-switch v-model:checked="generalConfig.optionsEnabled" />
            </a-form-item>
            <a-form-item label="Giới hạn giao dịch tối thiểu">
              <a-input-number
                v-model:value="generalConfig.minTradeAmount"
                style="width: 100%"
                :min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
            <a-form-item label="Giới hạn giao dịch tối đa">
              <a-input-number
                v-model:value="generalConfig.maxTradeAmount"
                style="width: 100%"
                :min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
            <a-form-item label="Phí giao dịch (%)">
              <a-input-number
                v-model:value="generalConfig.tradingFee"
                style="width: 100%"
                :min="0"
                :max="100"
                :step="0.01"
              />
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="Cấu hình thời gian" style="margin-bottom: 24px">
          <a-form layout="vertical">
            <a-form-item label="Thời gian hết hạn tối thiểu (phút)">
              <a-input-number
                v-model:value="timeConfig.minExpiryTime"
                style="width: 100%"
                :min="1"
                :max="1440"
              />
            </a-form-item>
            <a-form-item label="Thời gian hết hạn tối đa (phút)">
              <a-input-number
                v-model:value="timeConfig.maxExpiryTime"
                style="width: 100%"
                :min="1"
                :max="1440"
              />
            </a-form-item>
            <a-form-item label="Khoảng thời gian hết hạn (phút)">
              <a-input-number
                v-model:value="timeConfig.expiryInterval"
                style="width: 100%"
                :min="1"
                :max="60"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="Cấu hình rủi ro" style="margin-bottom: 24px">
          <a-form layout="vertical">
            <a-form-item label="Giới hạn rủi ro tối đa (%)">
              <a-input-number
                v-model:value="riskConfig.maxRiskPercentage"
                style="width: 100%"
                :min="0"
                :max="100"
                :step="0.1"
              />
            </a-form-item>
            <a-form-item label="Giới hạn lỗ tối đa">
              <a-input-number
                v-model:value="riskConfig.maxLossAmount"
                style="width: 100%"
                :min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
              />
            </a-form-item>
            <a-form-item label="Kích hoạt stop-loss">
              <a-switch v-model:checked="riskConfig.stopLossEnabled" />
            </a-form-item>
            <a-form-item label="Kích hoạt take-profit">
              <a-switch v-model:checked="riskConfig.takeProfitEnabled" />
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="Cấu hình thông báo">
          <a-form layout="vertical">
            <a-form-item label="Thông báo qua email">
              <a-switch v-model:checked="notificationConfig.emailEnabled" />
            </a-form-item>
            <a-form-item label="Thông báo qua SMS">
              <a-switch v-model:checked="notificationConfig.smsEnabled" />
            </a-form-item>
            <a-form-item label="Thông báo qua push notification">
              <a-switch v-model:checked="notificationConfig.pushEnabled" />
            </a-form-item>
            <a-form-item label="Email quản trị">
              <a-input v-model:value="notificationConfig.adminEmail" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="Lịch sử thay đổi">
      <a-timeline>
        <a-timeline-item v-for="change in configHistory" :key="change.id">
          <template #dot>
            <a-avatar :size="24" :src="change.userAvatar" />
          </template>
          <div class="change-item">
            <div class="change-title">{{ change.title }}</div>
            <div class="change-time">{{ formatDate(change.timestamp) }}</div>
            <div class="change-user">Bởi: {{ change.userName }}</div>
            <div class="change-description">{{ change.description }}</div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'

// Data
const loading = ref(false)

// Configuration objects
const generalConfig = reactive({
  optionsEnabled: true,
  minTradeAmount: 100000,
  maxTradeAmount: 1000000000,
  tradingFee: 0.5
})

const timeConfig = reactive({
  minExpiryTime: 5,
  maxExpiryTime: 1440,
  expiryInterval: 5
})

const riskConfig = reactive({
  maxRiskPercentage: 10,
  maxLossAmount: 50000000,
  stopLossEnabled: true,
  takeProfitEnabled: true
})

const notificationConfig = reactive({
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  adminEmail: 'admin@example.com'
})

// Configuration history
const configHistory = ref([
  {
    id: 1,
    title: 'Cập nhật phí giao dịch',
    description: 'Thay đổi phí giao dịch từ 0.3% lên 0.5%',
    timestamp: '2024-01-15T10:30:00Z',
    userName: 'Admin User',
    userAvatar: ''
  },
  {
    id: 2,
    title: 'Kích hoạt stop-loss',
    description: 'Bật tính năng stop-loss tự động',
    timestamp: '2024-01-14T15:45:00Z',
    userName: 'Admin User',
    userAvatar: ''
  }
])

// Methods
const fetchConfigs = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await configApi.getOptionsConfigs()
    // Object.assign(generalConfig, response.data.general)
    // Object.assign(timeConfig, response.data.time)
    // Object.assign(riskConfig, response.data.risk)
    // Object.assign(notificationConfig, response.data.notification)

    // Mock data for now
    Object.assign(generalConfig, {
      optionsEnabled: true,
      minTradeAmount: 100000,
      maxTradeAmount: 1000000000,
      tradingFee: 0.5
    })

    Object.assign(timeConfig, {
      minExpiryTime: 5,
      maxExpiryTime: 1440,
      expiryInterval: 5
    })

    Object.assign(riskConfig, {
      maxRiskPercentage: 10,
      maxLossAmount: 50000000,
      stopLossEnabled: true,
      takeProfitEnabled: true
    })

    Object.assign(notificationConfig, {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      adminEmail: 'admin@example.com'
    })
  } catch (error) {
    message.error('Không thể tải cấu hình')
  } finally {
    loading.value = false
  }
}

const saveAllConfigs = async () => {
  try {
    // TODO: Replace with actual API call
    // await configApi.updateOptionsConfigs({
    //   general: generalConfig,
    //   time: timeConfig,
    //   risk: riskConfig,
    //   notification: notificationConfig
    // })

    message.success('Đã lưu cấu hình thành công')
    
    // Add to history
    configHistory.value.unshift({
      id: Date.now(),
      title: 'Cập nhật cấu hình',
      description: 'Cập nhật tất cả cấu hình options',
      timestamp: new Date().toISOString(),
      userName: 'Admin User',
      userAvatar: ''
    })
  } catch (error) {
    message.error('Không thể lưu cấu hình')
  }
}

const refreshData = () => {
  fetchConfigs()
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

// Lifecycle
onMounted(() => {
  fetchConfigs()
})
</script>

<style scoped>
.options-config {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.change-item {
  margin-left: 16px;
}

.change-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.change-time {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.change-user {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.change-description {
  color: #666;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
