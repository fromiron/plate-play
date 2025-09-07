/**
 * 익명 리뷰 세션 관리
 * - 방문 시 임시 세션 토큰 생성 (localStorage)
 * - 토큰은 24시간 후 자동 만료
 * - 리뷰 작성 후 해당 메뉴-토큰 조합 저장
 */

const SESSION_TOKEN_KEY = "plateplay_anonymous_session";
const EXPIRY_HOURS = 24;

export interface AnonymousSession {
	token: string;
	createdAt: number;
	expiresAt: number;
	menuBoardId: string;
}

/**
 * 새로운 익명 세션 토큰 생성
 */
function generateSessionToken(): string {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).substring(2, 15);
	return `anon_${timestamp}_${random}`;
}

/**
 * 현재 시간으로부터 24시간 후 만료 시간 계산
 */
function getExpiryTime(): number {
	return Date.now() + EXPIRY_HOURS * 60 * 60 * 1000;
}

/**
 * 메뉴판 방문 시 세션 토큰 생성 또는 기존 토큰 반환
 */
export function getOrCreateAnonymousSession(
	menuBoardId: string,
): AnonymousSession {
	if (typeof window === "undefined") {
		// 서버사이드에서는 임시 토큰 생성
		const now = Date.now();
		return {
			token: generateSessionToken(),
			createdAt: now,
			expiresAt: now + EXPIRY_HOURS * 60 * 60 * 1000,
			menuBoardId,
		};
	}

	try {
		const stored = localStorage.getItem(SESSION_TOKEN_KEY);
		if (stored) {
			const session: AnonymousSession = JSON.parse(stored);

			// 토큰이 만료되지 않았고 같은 메뉴판인 경우 재사용
			if (
				session.expiresAt > Date.now() &&
				session.menuBoardId === menuBoardId
			) {
				return session;
			}
		}
	} catch (error) {
		console.warn("Failed to parse stored anonymous session:", error);
	}

	// 새로운 세션 생성
	const now = Date.now();
	const newSession: AnonymousSession = {
		token: generateSessionToken(),
		createdAt: now,
		expiresAt: getExpiryTime(),
		menuBoardId,
	};

	try {
		localStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(newSession));
	} catch (error) {
		console.warn("Failed to store anonymous session:", error);
	}

	return newSession;
}

/**
 * 현재 세션이 유효한지 확인
 */
export function isSessionValid(session: AnonymousSession): boolean {
	return session.expiresAt > Date.now();
}

/**
 * 만료된 세션 정리
 */
export function cleanupExpiredSession(): void {
	if (typeof window === "undefined") return;

	try {
		const stored = localStorage.getItem(SESSION_TOKEN_KEY);
		if (stored) {
			const session: AnonymousSession = JSON.parse(stored);
			if (!isSessionValid(session)) {
				localStorage.removeItem(SESSION_TOKEN_KEY);
			}
		}
	} catch (error) {
		console.warn("Failed to cleanup expired session:", error);
		localStorage.removeItem(SESSION_TOKEN_KEY);
	}
}

/**
 * 특정 메뉴 아이템에 대해 리뷰 작성 가능한지 확인
 * (같은 토큰으로 같은 메뉴에 중복 리뷰 방지)
 */
export function canReviewMenuItem(
	menuItemId: string,
	existingReviews: Array<{ menuItemId: string; sessionToken: string }>,
): boolean {
	if (typeof window === "undefined") return true;

	try {
		const stored = localStorage.getItem(SESSION_TOKEN_KEY);
		if (!stored) return true;

		const session: AnonymousSession = JSON.parse(stored);
		if (!isSessionValid(session)) return true;

		// 같은 토큰으로 작성된 리뷰가 있는지 확인
		const hasExistingReview = existingReviews.some(
			(review) =>
				review.menuItemId === menuItemId &&
				review.sessionToken === session.token,
		);

		return !hasExistingReview;
	} catch (error) {
		console.warn("Failed to check review permission:", error);
		return true;
	}
}

/**
 * 세션 토큰을 데이터베이스 저장용 Date 객체로 변환
 */
export function getSessionExpiryDate(session: AnonymousSession): Date {
	return new Date(session.expiresAt);
}
