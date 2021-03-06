/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { NamespaceRegistrationTransaction, NamespaceRegistrationType, UInt64 } from 'symbol-sdk'
// internal dependencies
import { TransactionView } from './TransactionView'
import { NamespaceModel } from '@/core/database/entities/NamespaceModel'
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel'
import { TransactionDetailItem } from '@/core/transactions/TransactionDetailItem'
import { TimeHelpers } from '@/core/utils/TimeHelpers'

/// region custom types
export type NamespaceRegistrationFormFieldsType = {
  rootNamespaceName: string
  subNamespaceName?: string
  registrationType: NamespaceRegistrationType
  duration?: number
  maxFee: UInt64
}

/// end-region custom types

export class ViewNamespaceRegistrationTransaction extends TransactionView<NamespaceRegistrationFormFieldsType> {
  /**
   * Fields that are specific to transfer transactions
   * @var {string[]}
   */
  protected readonly fields: string[] = [
    'rootNamespaceName',
    'namespaceRegistrationType',
    'subNamespaceName',
    'duration',
  ]

  /**
   * Parse form items and return a ViewNamespaceRegistrationTransaction
   * @param {NamespaceRegistrationFormFieldsType} formItems
   * @return {ViewNamespaceRegistrationTransaction}
   */
  public parse(formItems: NamespaceRegistrationFormFieldsType): ViewNamespaceRegistrationTransaction {
    // - parse form items to view values
    this.values.set('rootNamespaceName', formItems.rootNamespaceName)
    this.values.set('registrationType', formItems.registrationType)
    this.values.set('subNamespaceName', formItems.subNamespaceName || null)
    this.values.set('duration', formItems.duration ? UInt64.fromUint(formItems.duration) : null)

    // - set fee and return
    this.values.set('maxFee', formItems.maxFee)
    return this
  }

  /**
   * Use a transaction object and return a ViewNamespaceRegistrationTransaction
   * @param {NamespaceRegistrationTransaction} transaction
   * @return {ViewNamespaceRegistrationTransaction}
   */
  public use(transaction: NamespaceRegistrationTransaction): ViewNamespaceRegistrationTransaction {
    // - set transaction
    this.transaction = transaction

    // - populate common values
    this.initialize(transaction)

    // - read transaction fields
    if (NamespaceRegistrationType.RootNamespace === transaction.registrationType) {
      this.values.set('rootNamespaceName', transaction.namespaceName)
    } else {
      this.values.set('subNamespaceName', transaction.namespaceName)

      // - try to identify root namespace by id
      const parentId = transaction.parentId
      const namespaces: NamespaceModel[] = this.$store.getters['namespace/namespaces']
      const parent = namespaces.find((n) => n.namespaceIdHex === parentId.toHex() && n.name)
      if (parent) {
        this.values.set('rootNamespaceName', parent.name)
      }
    }

    // - set type and duration
    this.values.set('registrationType', transaction.registrationType)
    this.values.set('duration', transaction.duration || null)
    return this
  }

  /**
   * Displayed items
   */
  public resolveDetailItems(): TransactionDetailItem[] {
    const rootNamespaceName: string = this.values.get('rootNamespaceName')
    const subNamespaceName: string = this.values.get('subNamespaceName')
    const registrationType: NamespaceRegistrationType = this.values.get('registrationType')
    const duration: UInt64 = this.values.get('duration')
    const networkConfiguration: NetworkConfigurationModel = this.$store.getters['network/networkConfiguration']
    const blockGenerationTargetTime = networkConfiguration.blockGenerationTargetTime
    if (registrationType === NamespaceRegistrationType.RootNamespace) {
      return [
        { key: 'namespace_name', value: rootNamespaceName },
        {
          key: 'duration',
          value: TimeHelpers.durationToRelativeTime(parseInt(duration.toString()), blockGenerationTargetTime),
        },
      ]
    }

    return [
      { key: 'namespace_name', value: subNamespaceName },
      {
        key: 'parent_namespace',
        value: rootNamespaceName,
      },
    ]
  }
}
