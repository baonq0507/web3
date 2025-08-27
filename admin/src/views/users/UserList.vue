<template>
  <div class="user-list">
    <div class="page-header">
      <h1>Quản lý người dùng</h1>
      <a-button type="primary" @click="showCreateModal = true">
        <template #icon><UserAddOutlined /></template>
        Thêm người dùng mới
      </a-button>
    </div>

    <a-card>
      <div class="search-bar">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm người dùng..."
          style="width: 300px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="roleFilter"
          placeholder="Lọc theo vai trò"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả vai trò</a-select-option>
          <a-select-option value="USER">Người dùng</a-select-option>
          <a-select-option value="ADMIN">Quản trị viên</a-select-option>
          <a-select-option value="SUPERADMIN">Siêu quản trị</a-select-option>
          <a-select-option value="SUPPORT">Hỗ trợ</a-select-option>
          <a-select-option value="AUDITOR">Kiểm toán</a-select-option>
        </a-select>
      </div>

      <a-table
        :columns="columns"
        :data-source="filteredUsers"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ getRoleText(record.role) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="viewUser(record)">
                <template #icon><EyeOutlined /></template>
                Xem
              </a-button>
              <a-button type="link" @click="editUser(record)">
                <template #icon><EditOutlined /></template>
                Sửa
              </a-button>
              <a-popconfirm
                title="Bạn có chắc muốn xóa người dùng này?"
                @confirm="deleteUser(record.id)"
              >
                <a-button type="link" danger>
                  <template #icon><DeleteOutlined /></template>
                  Xóa
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit User Modal -->
    <a-modal
      v-model:open="showCreateModal"
      :title="editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'"
      @ok="handleSaveUser"
      @cancel="handleCancelEdit"
      width="600px"
    >
      <a-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Email" name="email">
              <a-input v-model:value="userForm.email" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Mật khẩu" name="password" v-if="!editingUser">
              <a-input-password v-model:value="userForm.password" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Vai trò" name="role">
              <a-select v-model:value="userForm.role">
                <a-select-option value="USER">Người dùng</a-select-option>
                <a-select-option value="ADMIN">Quản trị viên</a-select-option>
                <a-select-option value="SUPERADMIN">Siêu quản trị</a-select-option>
                <a-select-option value="SUPPORT">Hỗ trợ</a-select-option>
                <a-select-option value="AUDITOR">Kiểm toán</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Trạng thái" name="status">
          <a-select v-model:value="userForm.status">
            <a-select-option value="ACTIVE">Hoạt động</a-select-option>
            <a-select-option value="INACTIVE">Không hoạt động</a-select-option>
            <a-select-option value="SUSPENDED">Tạm khóa</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import usersApi from '@/api/users'
import {
  UserAddOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// Data
const loading = ref(false)
const users = ref<any[]>([])
const searchQuery = ref('')
const roleFilter = ref('')
const showCreateModal = ref(false)
const editingUser = ref<any>(null)
const userFormRef = ref()

// Form data
const userForm = reactive({
  email: '',
  password: '',
  role: 'USER',
  status: 'ACTIVE'
})

// Form validation rules
const userFormRules = {
  email: [
    { required: true, message: 'Vui lòng nhập email' },
    { type: 'email', message: 'Email không hợp lệ' }
  ],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }],
  role: [{ required: true, message: 'Vui lòng chọn vai trò' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái' }]
}

// Table columns
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Vai trò',
    key: 'role',
    dataIndex: 'role'
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 200
  }
]

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
})

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    const params: any = {
      page: Math.max(1, pagination.current),
      limit: Math.max(1, pagination.pageSize)
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (roleFilter.value) {
      params.role = roleFilter.value
    }
    const response = await usersApi.getUsers(params)
    users.value = response.users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt).toLocaleDateString('vi-VN')
    }))
    pagination.total = response.total
  } catch (error) {
    message.error('Không thể tải danh sách người dùng')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchUsers()
}

const handleFilter = () => {
  pagination.current = 1
  fetchUsers()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchUsers()
}

const viewUser = (user: any) => {
  router.push(`/users/${user.id}`)
}

const editUser = (user: any) => {
  editingUser.value = user
  Object.assign(userForm, {
    email: user.email,
    role: user.role,
    status: user.status
  })
  showCreateModal.value = true
}

const deleteUser = async (userId: string) => {
  try {
    await usersApi.deleteUser(userId)
    message.success('Xóa người dùng thành công')
    fetchUsers()
  } catch (error) {
    message.error('Không thể xóa người dùng')
  }
}

const handleSaveUser = async () => {
  try {
    await userFormRef.value.validate()
    
    if (editingUser.value) {
      await usersApi.updateUser(editingUser.value.id, userForm)
      message.success('Cập nhật người dùng thành công')
    } else {
      await usersApi.createUser(userForm)
      message.success('Tạo người dùng thành công')
    }
    
    showCreateModal.value = false
    handleCancelEdit()
    fetchUsers()
  } catch (error) {
    message.error('Vui lòng kiểm tra lại thông tin')
  }
}

const handleCancelEdit = () => {
  editingUser.value = null
  userFormRef.value?.resetFields()
  Object.assign(userForm, {
    username: '',
    email: '',
    password: '',
    role: 'USER',
    status: 'ACTIVE'
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ACTIVE: 'green',
    INACTIVE: 'orange',
    SUSPENDED: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    SUSPENDED: 'Tạm khóa'
  }
  return texts[status] || status
}

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    USER: 'blue',
    ADMIN: 'purple',
    SUPERADMIN: 'red',
    SUPPORT: 'green',
    AUDITOR: 'orange'
  }
  return colors[role] || 'default'
}

const getRoleText = (role: string) => {
  const texts: Record<string, string> = {
    USER: 'Người dùng',
    ADMIN: 'Quản trị viên',
    SUPERADMIN: 'Siêu quản trị',
    SUPPORT: 'Hỗ trợ',
    AUDITOR: 'Kiểm toán'
  }
  return texts[role] || role
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list {
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

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
