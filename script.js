document.addEventListener('DOMContentLoaded', () => {
    const patchNotesContainer = document.querySelector('.note-container');
    const newNoteButton = document.querySelector('.note-header button');

    // 패치 노트 아이템을 동적으로 생성하는 함수
    function createNoteItem(title, content = '') {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');
        noteItem.innerHTML = `
            <h4>${title}</h4>
            <div class="note-content" style="display: none;">
                <textarea class="note-editor" placeholder="여기에 내용을 입력하세요.">${content}</textarea>
                <div class="button-group">
                    <button class="save-button">저장</button>
                    <button class="cancel-button">취소</button>
                </div>
            </div>
        `;

        // 클릭 이벤트 리스너 추가
        noteItem.addEventListener('click', () => {
            const contentDiv = noteItem.querySelector('.note-content');
            const editor = noteItem.querySelector('.note-editor');
            const noteTitle = noteItem.querySelector('h4');

            // 이미 열려있으면 닫기
            if (contentDiv.style.display === 'block') {
                contentDiv.style.display = 'none';
                return;
            }

            // 모든 노트 닫고 현재 노트 열기
            document.querySelectorAll('.note-content').forEach(note => {
                note.style.display = 'none';
            });
            contentDiv.style.display = 'block';
            editor.focus();

            // 저장 버튼
            noteItem.querySelector('.save-button').onclick = (e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                contentDiv.style.display = 'none';
                noteTitle.textContent = editor.value.split('\n')[0] || '제목 없음'; // 첫 줄을 제목으로
                localStorage.setItem(noteTitle.textContent, editor.value);
            };

            // 취소 버튼
            noteItem.querySelector('.cancel-button').onclick = (e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                contentDiv.style.display = 'none';
                editor.value = localStorage.getItem(noteTitle.textContent) || ''; // 저장된 내용으로 복원
            };
        });

        return noteItem;
    }

    // 로컬 스토리지에서 기존 데이터 불러오기
    function loadSavedNotes() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const content = localStorage.getItem(key);
            if (content) {
                const noteItem = createNoteItem(key, content);
                patchNotesContainer.appendChild(noteItem);
            }
        }
    }

    // 새로 만들기 버튼 클릭 이벤트
    newNoteButton.addEventListener('click', () => {
        const newNoteTitle = prompt('새로운 패치 노트의 제목을 입력하세요:', '새로운 패치 노트');
        if (newNoteTitle) {
            const newNoteItem = createNoteItem(newNoteTitle);
            patchNotesContainer.appendChild(newNoteItem);
            localStorage.setItem(newNoteTitle, '');
        }
    });

    // 초기 로딩 시 저장된 노트 불러오기
    loadSavedNotes();

    // 기존 노트 아이템에 이벤트 리스너 추가 (초기에 HTML에 작성된 노트)
    document.querySelectorAll('.note-item').forEach(item => {
        const title = item.querySelector('h4').textContent;
        const content = localStorage.getItem(title) || '';
        item.innerHTML = `
            <h4>${title}</h4>
            <div class="note-content" style="display: none;">
                <textarea class="note-editor" placeholder="여기에 내용을 입력하세요.">${content}</textarea>
                <div class="button-group">
                    <button class="save-button">저장</button>
                    <button class="cancel-button">취소</button>
                </div>
            </div>
        `;
        item.addEventListener('click', () => {
            const contentDiv = item.querySelector('.note-content');
            const editor = item.querySelector('.note-editor');
            const noteTitle = item.querySelector('h4');
            
            if (contentDiv.style.display === 'block') {
                contentDiv.style.display = 'none';
                return;
            }

            document.querySelectorAll('.note-content').forEach(note => {
                note.style.display = 'none';
            });
            contentDiv.style.display = 'block';
            editor.focus();

            item.querySelector('.save-button').onclick = (e) => {
                e.stopPropagation();
                contentDiv.style.display = 'none';
                const newTitle = editor.value.split('\n')[0] || title;
                if (newTitle !== title) {
                    localStorage.removeItem(title);
                    noteTitle.textContent = newTitle;
                    localStorage.setItem(newTitle, editor.value);
                } else {
                    localStorage.setItem(newTitle, editor.value);
                }
            };

            item.querySelector('.cancel-button').onclick = (e) => {
                e.stopPropagation();
                contentDiv.style.display = 'none';
                editor.value = localStorage.getItem(title) || '';
            };
        });
    });
});