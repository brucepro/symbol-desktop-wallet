<template>
  <div>
    <Select v-model="selectedSigner" size="large" prefix="ios-home" @input="onSignerChange">
      <Icon slot="prefix" type="ios-people" size="24" />
      <OptionGroup label="Multisig accounts">
        <Option v-for="item in signers" :key="item.publicKey" :value="item.publicKey">
          {{ item.label }}
          {{ item.multisig ? $t('label_postfix_multisig') : '' }}
        </Option>
      </OptionGroup>
    </Select>
  </div>
</template>
<script lang="ts">
// @ts-ignore
import { TransactionAddressFilterTs } from './TransactionAddressFilterTs'
export default class TransactionAddressFilter extends TransactionAddressFilterTs {}
</script>
<style lang="less" scoped>
@import './TransactionAddressFilter.less';
</style>
