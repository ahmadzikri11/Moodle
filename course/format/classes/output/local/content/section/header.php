<?php
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
 * Contains the default section header format output class.
 *
 * @package   core_courseformat
 * @copyright 2020 Ferran Recio <ferran@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace core_courseformat\output\local\content\section;

use core_courseformat\base as course_format;
use section_info;
use renderable;
use templatable;
use stdClass;

/**
 * Base class to render a section header.
 *
 * @package   core_courseformat
 * @copyright 2020 Ferran Recio <ferran@moodle.com>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class header implements renderable, templatable {

    /** @var course_format the course format class */
    protected $format;

    /** @var section_info the course section class */
    protected $section;

    /**
     * Constructor.
     *
     * @param course_format $format the course format
     * @param section_info $section the section info
     */
    public function __construct(course_format $format, section_info $section) {
        $this->format = $format;
        $this->section = $section;
    }

    /**
     * Export this data so it can be used as the context for a mustache template.
     *
     * @param renderer_base $output typically, the renderer that's calling this function
     * @return array data context for a mustache template
     */
    public function export_for_template(\renderer_base $output): stdClass {

        $format = $this->format;
        $section = $this->section;
        $course = $format->get_course();

        $data = (object)[
            'num' => $section->section,
            'id' => $section->id,
        ];

        if ($section->section > $format->get_last_section_number()) {
            // Stealth sections (orphaned) has special title.
            $data->title = get_string('orphanedactivitiesinsectionno', '', $section->section);
        } else if ($section->section && ($section->section == $format->get_section_number())) {
            // Regular section title.
            $data->title = $output->section_title_without_link($section, $course);
            $data->issinglesection = true;
        } else if ($section->uservisible) {
            // Regular section title.
            $data->title = $output->section_title($section, $course);
        } else {
            // Regular section title without link.
            $data->title = $output->section_title_without_link($section, $course);
        }

        if (!$section->visible) {
            $data->ishidden = true;
        }

        $coursedisplay = $course->coursedisplay ?? COURSE_DISPLAY_SINGLEPAGE;

        if ($course->id == SITEID) {
            $data->sitehome = true;
        }

        if (!$format->show_editor() && $coursedisplay == COURSE_DISPLAY_MULTIPAGE && empty($data->issinglesection)) {
            if ($section->uservisible) {
                $data->url = course_get_url($course, $section->section);
            }
        }
        $data->name = get_section_name($course, $section);

        return $data;
    }
}
