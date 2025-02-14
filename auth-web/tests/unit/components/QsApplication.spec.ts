import { createLocalVue, shallowMount } from '@vue/test-utils'
import QsApplication from '@/components/auth/staff/review-task/QsApplication.vue'
import { TaskType } from '@/util/constants'
import Vuetify from 'vuetify'

// Mocked props
const mockProps = {
  tabNumber: 1,
  title: 'Test Application',
  taskDetails: {
    type: TaskType.MHR_LAWYER_NOTARY,
    created: new Date()
  },
  accountUnderReview: {
    name: 'Test Organization',
    mailingAddress: {
      // Add required properties for mailingAddress
    }
  },
  accountUnderReviewAdmin: {
    firstname: 'John',
    lastname: 'Doe'
  },
  accountUnderReviewAdminContact: {
    email: 'john.doe@example.com',
    phone: '123-456-7890'
  }
}

const mockQsApplicantData = {
  businessName: 'Test Business',
  phoneNumber: '987-654-3210',
  authorizationName: 'Authorized Person',
  address: {
  }
}

describe('QsApplication.vue', () => {
  let wrapper
  const localVue = createLocalVue()
  const vuetify = new Vuetify({})

  beforeEach(() => {
    wrapper = shallowMount(QsApplication, {
      localVue,
      vuetify,
      propsData: mockProps
    })

    // Set the mock qsApplicantData
    wrapper.vm.qsApplicantData = mockQsApplicantData
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct tabNumber in the title', () => {
    const title = wrapper.find('h2').text()
    expect(title).toContain('1. Test Application')
  })

  it('displays the correct title', () => {
    const title = wrapper.find('h2').text()
    expect(title).toContain('Test Application')
  })

  it('displays the correct task type', () => {
    const taskType = wrapper.findAll('h3').at(1).text()
    expect(taskType).toBe('Qualified Supplier (Lawyers and Notaries) Information')
  })

  it('displays the correct applicant organization name', () => {
    const orgName = wrapper.find('[data-test="qs-org-name"]').text()
    expect(orgName).toContain('Test Business')
  })

  it('displays the correct admin full name', () => {
    const adminName = wrapper.find('[data-test="qs-username"]').text()
    expect(adminName).toContain('John Doe')
  })

  it('displays the correct admin contact email', () => {
    const adminEmail = wrapper.find('[data-test="qs-email"]').text()
    expect(adminEmail).toContain('john.doe@example.com')
  })

  it('displays the correct applicant contact phone number', () => {
    const adminPhone = wrapper.find('[data-test="qs-phone"]').text()
    expect(adminPhone).toContain('(987) 654-3210')
  })
})
