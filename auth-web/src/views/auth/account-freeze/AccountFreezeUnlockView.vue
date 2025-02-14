<template>
  <v-container
    v-if="isAccountStatusNsfSuspended"
    class="view-container"
  >
    <div class="view-header">
      <div class="view-header__icon">
        <v-icon
          large
          color="error"
          class="mt-1 mr-4"
        >
          mdi-alert-circle-outline
        </v-icon>
      </div>
      <div>
        <h1 class="view-header__title">
          This account has been temporarily suspended
        </h1>
        <p class="mt-3 mb-0">
          To unlock your account, please complete the following steps.
        </p>
      </div>
    </div>
    <v-card flat>
      <Stepper
        :stepper-configuration="stepperConfig"
        :isLoading="isLoading"
        :stepperColor="'error'"
        @final-step-action="unlockAccount"
      />
    </v-card>

    <!-- Alert Dialog (Error) -->
    <ModalDialog
      ref="errorDialog"
      :title="errorTitle"
      :text="errorText"
      dialog-class="notify-dialog"
      max-width="640"
    >
      <template #icon>
        <v-icon
          large
          color="error"
        >
          mdi-alert-circle-outline
        </v-icon>
      </template>
      <template #actions>
        <v-btn
          large
          color="error"
          class="font-weight-bold"
          @click="closeError"
        >
          OK
        </v-btn>
      </template>
    </ModalDialog>
  </v-container>
  <v-container
    v-else
    class="view-container"
  >
    <AccountSuspendedView :isAdmin="true" />
  </v-container>
</template>

<script lang="ts">
import { AccountStatus, Pages } from '@/util/constants'
import { Component, Vue } from 'vue-property-decorator'
import Stepper, { StepConfiguration } from '@/components/auth/common/stepper/Stepper.vue'
import { mapActions, mapState } from 'pinia'
import AccountOverview from '@/components/auth/account-freeze/AccountOverview.vue'
import AccountSuspendedView from './AccountSuspendedView.vue'
import ConfigHelper from 'sbc-common-components/src/util/config-helper'
import { KCUserProfile } from 'sbc-common-components/src/models/KCUserProfile'
import ModalDialog from '@/components/auth/common/ModalDialog.vue'
import { Organization } from '@/models/Organization'
import { Payment } from '@/models/Payment'
import PaymentReview from '@/components/auth/account-freeze/PaymentReview.vue'
import ReviewBankInformation from '@/components/auth/account-freeze/ReviewBankInformation.vue'
import { useOrgStore } from '@/stores/org'
import { useUserStore } from '@/stores/user'

@Component({
  components: {
    AccountOverview,
    ReviewBankInformation,
    PaymentReview,
    Stepper,
    ModalDialog,
    AccountSuspendedView
  },
  methods: {
    ...mapActions(useOrgStore, [
      'createAccountPayment'

    ])
  },
  computed: {
    ...mapState(useUserStore, [
      'userContact'
    ]),
    ...mapState(useOrgStore, [
      'currentOrganization'
    ])

  }
})
export default class AccountFreezeUnlockView extends Vue {
  private readonly currentUser!: KCUserProfile
  private readonly currentOrganization!: Organization
  private readonly createAccountPayment!: () => Payment
  private errorTitle = 'Account unlocking failed'
  private errorText = ''
  private isLoading: boolean = false

  $refs: {
    errorDialog: InstanceType<typeof ModalDialog>
  }

  private stepperConfig: Array<StepConfiguration> =
    [
      {
        title: 'Account Overview',
        stepName: 'Account Overview',
        component: AccountOverview,
        componentProps: {}
      },
      {
        title: 'Review Information',
        stepName: 'Review Information',
        component: ReviewBankInformation,
        componentProps: {}
      },
      {
        title: 'Payment & Review',
        stepName: 'Payment & Review',
        component: PaymentReview,
        componentProps: {}
      }
    ]

  private async unlockAccount () {
    const payment: Payment = await this.createAccountPayment()
    const returnUrl = `${ConfigHelper.getAuthContextPath()}/${Pages.ACCOUNT_UNLOCK_SUCCESS}`
    const encodedUrl = encodeURIComponent(returnUrl)
    // redirect to make payment UI
    await this.$router.push(`${Pages.MAKE_PAD_PAYMENT}${payment.id}/transactions/${encodedUrl}`)
  }

  private get isAccountStatusNsfSuspended () : boolean {
    return this.currentOrganization.statusCode === AccountStatus.NSF_SUSPENDED
  }
  private closeError () {
    this.$refs.errorDialog.close()
  }
}
</script>
