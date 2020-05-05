<template>
  <div class="transaction-details-item-inner-container">
    <div v-for="(item, index) in items" :key="index" class="transaction-row-outer-container">
      <TransactionDetailRow :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator'
import { LinkAction } from 'symbol-sdk'

// internal dependencies
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

// child components
import { TransactionDetailItem } from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailItem'
import { ViewAccountLinkTransaction } from '../../../core/transactions/ViewAccountLinkTransaction'

@Component({ components: { TransactionDetailRow } })
export default class AccountLink extends Vue {
  @Prop({ default: null }) view: ViewAccountLinkTransaction

  protected get items(): TransactionDetailItem[] {
    const remotePublicKey = this.view.values.get('remotePublicKey')
    const action = this.view.values.get('linkAction')

    return [
      { key: 'action', value: LinkAction[action] },
      { key: 'Remote_public_key', value: remotePublicKey },
    ]
  }
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
