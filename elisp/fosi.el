;;; fosi.el ---  -*- lexical-binding: t -*-

;; Copyright (C) 2021 Yasunori Horikoshi

;; Permission is hereby granted, free of charge, to any person obtaining
;; a copy of this software and associated documentation files (the "Software"),
;; to deal in the Software without restriction, including without limitation the rights
;; to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
;; copies of the Software, and to permit persons to whom the
;; Software is furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice
;; shall be included in all copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
;; IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
;; DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
;; ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

;; Author: Yasunori Horikoshi <horikoshi.et.al@gmail.com>
;; Version: 1.4.0


;;; Commentary:


;;; Code:

(defun fosi ()
  "Launch fosi process and watch the file."
  (interactive)
  (let ((orig-buf (current-buffer))
        (buffer (generate-new-buffer "*fosi*")))
    (start-process "fosi" buffer "fosi" "-f" "-i" (buffer-file-name))
    (switch-to-buffer buffer)
    (while (not (search-backward "htmlPort" nil t))
      (message "not found")
      (sit-for 0.1))
    (message "%s %s"
             (buffer-substring-no-properties
              (line-beginning-position) (line-end-position))
             (buffer-name))
    (goto-char (point-max))
    (switch-to-buffer orig-buf)))

(provide 'fosi)
;;; fosi.el ends here
