// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Report builder columns editor
 *
 * @module      core_reportbuilder/local/editor/columns
 * @copyright   2021 Paul Holden <paulh@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

"use strict";

import $ from 'jquery';
import {dispatchEvent} from 'core/event_dispatcher';
import 'core/inplace_editable';
import {eventTypes as inplaceEditableEvents} from 'core/local/inplace_editable/events';
import Notification from 'core/notification';
import Pending from 'core/pending';
import {publish} from 'core/pubsub';
import SortableList from 'core/sortable_list';
import {get_string as getString, get_strings as getStrings} from 'core/str';
import {add as addToast} from 'core/toast';
import * as reportEvents from 'core_reportbuilder/local/events';
import * as reportSelectors from 'core_reportbuilder/local/selectors';
import {addColumn, deleteColumn, reorderColumn} from 'core_reportbuilder/local/repository/columns';

/**
 * Initialise module
 *
 * @param {Element} reportElement
 * @param {Boolean} initialized Ensure we only add our listeners once
 */
export const init = (reportElement, initialized) => {
    if (initialized) {
        return;
    }

    reportElement.addEventListener('click', event => {

        // Add column to report.
        const reportAddColumn = event.target.closest(reportSelectors.actions.reportAddColumn);
        if (reportAddColumn) {
            event.preventDefault();

            const pendingPromise = new Pending('core_reportbuilder/columns:add');

            addColumn(reportElement.dataset.reportId, reportAddColumn.dataset.uniqueIdentifier)
                .then(data => publish(reportEvents.publish.reportColumnsUpdated, data))
                .then(() => getString('columnadded', 'core_reportbuilder', reportAddColumn.dataset.name))
                .then(addToast)
                .then(() => {
                    dispatchEvent(reportEvents.tableReload, {preservePagination: true}, reportElement);
                    return pendingPromise.resolve();
                })
                .catch(Notification.exception);
        }

        // Remove column from report.
        const reportRemoveColumn = event.target.closest(reportSelectors.actions.reportRemoveColumn);
        if (reportRemoveColumn) {
            event.preventDefault();

            const columnHeader = reportRemoveColumn.closest(reportSelectors.regions.columnHeader);
            const columnName = columnHeader.dataset.columnName;

            getStrings([
                {key: 'deletecolumn', component: 'core_reportbuilder', param: columnName},
                {key: 'deletecolumnconfirm', component: 'core_reportbuilder', param: columnName},
                {key: 'delete', component: 'moodle'},
            ]).then(([confirmTitle, confirmText, confirmButton]) => {
                Notification.confirm(confirmTitle, confirmText, confirmButton, null, () => {
                    const pendingPromise = new Pending('core_reportbuilder/columns:remove');

                    deleteColumn(reportElement.dataset.reportId, columnHeader.dataset.columnId)
                        .then(data => publish(reportEvents.publish.reportColumnsUpdated, data))
                        .then(() => getString('columndeleted', 'core_reportbuilder', columnName))
                        .then(addToast)
                        .then(() => {
                            dispatchEvent(reportEvents.tableReload, {preservePagination: true}, reportElement);
                            return pendingPromise.resolve();
                        })
                        .catch(Notification.exception);
                });
                return;
            }).catch(Notification.exception);
        }
    });

    // Initialize sortable list to handle column moving (note JQuery dependency, see MDL-72293 for resolution).
    var columnSortableList = new SortableList(`${reportSelectors.regions.reportTable} thead tr`, {isHorizontal: true});
    columnSortableList.getElementName = element => Promise.resolve(element.data('columnName'));

    $(reportElement).on(SortableList.EVENTS.DRAG, 'th[data-column-id]', (event, info) => {
        const columnPosition = info.element.data('columnPosition');
        const targetColumnPosition = info.targetNextElement.data('columnPosition');

        $(reportElement).find('tbody tr').each(function() {
            const cell = $(this).children(`td.c${columnPosition - 1}`)[0];
            if (targetColumnPosition) {
                var beforeCell = $(this).children(`td.c${targetColumnPosition - 1}`)[0];
                this.insertBefore(cell, beforeCell);
            } else {
                this.appendChild(cell);
            }
        });
    });

    $(reportElement).on(SortableList.EVENTS.DROP, 'th[data-column-id]', (event, info) => {
        if (info.positionChanged) {
            const pendingPromise = new Pending('core_reportbuilder/columns:reorder');

            const columnId = info.element.data('columnId');
            const columnName = info.element.data('columnName');
            const columnPosition = info.element.data('columnPosition');

            // Select target position, if moving to the end then count number of element siblings.
            let targetColumnPosition = info.targetNextElement.data('columnPosition') || info.element.siblings().length + 2;
            if (targetColumnPosition > columnPosition) {
                targetColumnPosition--;
            }

            reorderColumn(reportElement.dataset.reportId, columnId, targetColumnPosition)
                .then(() => getString('columnmoved', 'core_reportbuilder', columnName))
                .then(addToast)
                .then(() => {
                    dispatchEvent(reportEvents.tableReload, {preservePagination: true}, reportElement);
                    return pendingPromise.resolve();
                })
                .catch(Notification.exception);
        }
    });

    // Initialize inplace editable listeners for column aggregation.
    reportElement.addEventListener(inplaceEditableEvents.elementUpdated, event => {

        const columnAggregation = event.target.closest('[data-itemtype="columnaggregation"]');
        if (columnAggregation) {
            const columnHeader = columnAggregation.closest(reportSelectors.regions.columnHeader);

            getString('columnaggregated', 'core_reportbuilder', columnHeader.dataset.columnName)
                .then(addToast)
                .then(() => {
                    dispatchEvent(reportEvents.tableReload, {}, reportElement);
                    return;
                })
                .catch(Notification.exception);
        }
    });
};
