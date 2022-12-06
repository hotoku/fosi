;;; fosi.el ---  -*- lexical-binding: t -*-


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
